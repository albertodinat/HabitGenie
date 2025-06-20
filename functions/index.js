const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp();

const ENABLE_NOTIFICATIONS =
  process.env.ENABLE_NOTIFICATIONS === undefined ||
  process.env.ENABLE_NOTIFICATIONS === 'true';

// Store timers for scheduled notifications
const appointmentTimers = {};

const sendPush = async (token, title, body) => {
  if (!ENABLE_NOTIFICATIONS) {
    console.log('Notifications disabled');
    return;
  }
  console.log('Sending push to', token, title);
  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: token, title, body })
    });
  } catch (err) {
    console.error('Error sending push', err);
  }
};

const scheduleReminder = (id, targetDate, token, title, body) => {
  const delay = targetDate.getTime() - Date.now();
  if (delay > 0 && delay < 540000) {
    console.log('Scheduling notification', id, title, 'in', delay, 'ms');
    const timer = setTimeout(() => {
      sendPush(token, title, body);
    }, delay);
    if (!appointmentTimers[id]) appointmentTimers[id] = [];
    appointmentTimers[id].push(timer);
  }
};

const clearTimers = (id) => {
  if (appointmentTimers[id]) {
    console.log('Clearing timers for', id);
    appointmentTimers[id].forEach((t) => clearTimeout(t));
    delete appointmentTimers[id];
  }
};

exports.onCreateAppointment = functions.firestore
  .document('rendezvous/{id}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const { patientId, date, time } = data;

    try {
      const patientSnap = await admin.firestore().doc(`users/${patientId}`).get();
      const pushToken = patientSnap.exists ? patientSnap.data().pushToken : null;

      if (!pushToken) {
        console.error('No push token for patient', patientId);
        return null;
      }

      await sendPush(pushToken, 'Rendez-vous enregistré', `RDV prévu le ${date} à ${time}`);

      const appointmentDateTime = new Date(`${date}T${time}`);
      const dayBefore = new Date(appointmentDateTime);
      dayBefore.setDate(dayBefore.getDate() - 1);
      dayBefore.setHours(18, 0, 0, 0);

      const threeHoursBefore = new Date(appointmentDateTime.getTime() - 3 * 60 * 60 * 1000);

      clearTimers(context.params.id);
      scheduleReminder(context.params.id, dayBefore, pushToken, 'Rappel : demain', `Rendez-vous demain à ${time}`);
      scheduleReminder(context.params.id, threeHoursBefore, pushToken, 'Rappel : aujourd\'hui', `Rendez-vous aujourd'hui à ${time}`);

      return null;
    } catch (error) {
      console.error('onCreateAppointment error:', error);
      return null;
    }
  });

exports.onUpdateAppointment = functions.firestore
  .document('rendezvous/{id}')
  .onUpdate(async (change, context) => {
    const data = change.after.data();
    const { patientId, date, time } = data;

    try {
      const patientSnap = await admin.firestore().doc(`users/${patientId}`).get();
      const pushToken = patientSnap.exists ? patientSnap.data().pushToken : null;

      if (!pushToken) {
        console.error('No push token for patient', patientId);
        return null;
      }

      await sendPush(pushToken, 'Rendez-vous modifié', `Nouveau RDV le ${date} à ${time}`);

      const appointmentDateTime = new Date(`${date}T${time}`);
      const dayBefore = new Date(appointmentDateTime);
      dayBefore.setDate(dayBefore.getDate() - 1);
      dayBefore.setHours(18, 0, 0, 0);

      const threeHoursBefore = new Date(appointmentDateTime.getTime() - 3 * 60 * 60 * 1000);

      clearTimers(context.params.id);
      scheduleReminder(context.params.id, dayBefore, pushToken, 'Rappel : demain', `Rendez-vous demain à ${time}`);
      scheduleReminder(context.params.id, threeHoursBefore, pushToken, 'Rappel : aujourd\'hui', `Rendez-vous aujourd'hui à ${time}`);

      return null;
    } catch (error) {
      console.error('onUpdateAppointment error:', error);
      return null;
    }
  });

exports.onDeleteAppointment = functions.firestore
  .document('rendezvous/{id}')
  .onDelete(async (snap, context) => {
    clearTimers(context.params.id);
    console.log('Appointment deleted', context.params.id);
    return null;
  });
