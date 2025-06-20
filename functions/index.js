const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp();

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

      const sendPush = async (title, body) => {
        try {
          await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: pushToken, title, body })
          });
        } catch (err) {
          console.error('Error sending push', err);
        }
      };

      await sendPush('Rendez-vous enregistré', `RDV prévu le ${date} à ${time}`);

      const appointmentDateTime = new Date(`${date}T${time}`);
      const dayBefore = new Date(appointmentDateTime);
      dayBefore.setDate(dayBefore.getDate() - 1);
      dayBefore.setHours(18, 0, 0, 0);

      const threeHoursBefore = new Date(appointmentDateTime.getTime() - 3 * 60 * 60 * 1000);

      const scheduleIfPossible = (targetDate, title, body) => {
        const delay = targetDate.getTime() - Date.now();
        if (delay > 0 && delay < 540000) {
          setTimeout(() => {
            sendPush(title, body);
          }, delay);
        }
      };

      scheduleIfPossible(dayBefore, 'Rappel : demain', `Rendez-vous demain à ${time}`);
      scheduleIfPossible(threeHoursBefore, 'Rappel : aujourd\'hui', `Rendez-vous aujourd'hui à ${time}`);

      return null;
    } catch (error) {
      console.error('onCreateAppointment error:', error);
      return null;
    }
  });
