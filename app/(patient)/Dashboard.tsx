import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';
import { db, auth } from '../../firebase.config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import dayjs from 'dayjs';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { sendPushNotification } from '../../utils/sendNotification';

export default function Dashboard() {
  const [programme, setProgramme] = useState<any>(null);
  const [completedDays, setCompletedDays] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    let sub: Notifications.Subscription | undefined;
    const register = async () => {
      if (!Device.isDevice) return;
      const { status: existing } = await Notifications.getPermissionsAsync();
      let final = existing;
      if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        final = status;
      }
      if (final !== 'granted') {
        Alert.alert('Notifications refusées', 'Vous ne recevrez pas de rappels');
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      const uid = auth.currentUser?.uid;
      if (uid) {
        await setDoc(
          doc(db, 'users', uid),
          { pushToken: tokenData.data },
          { merge: true }
        );
      }

      sub = Notifications.addNotificationReceivedListener((notification) => {
        const title = notification.request.content.title || 'Notification';
        const body = notification.request.content.body || '';
        Alert.alert(title, body);
      });
    };
    register();
    return () => {
      sub?.remove();
    };
  }, []);

  useEffect(() => {
    const fetchProgramme = async () => {
      const snap = await getDoc(doc(db, 'programmes', auth.currentUser?.uid || ''));
      setProgramme(snap.data());
      if (snap.data()?.days) {
        const init: { [key: string]: boolean } = {};
        Object.keys(snap.data().days).forEach((d) => (init[d] = false));
        setCompletedDays(init);
      }
    };
    fetchProgramme();
  }, []);

  const handleToggle = async (day: string, value: boolean) => {
    const updated = { ...completedDays, [day]: value };
    setCompletedDays(updated);
    if (!programme) return;
    const total = Object.keys(programme.days || {}).length;
    const done = Object.values(updated).filter(Boolean).length;
    const percentage = Math.round((done / total) * 100);
    const today = dayjs().format('YYYY-MM-DD');
    await setDoc(
      doc(db, 'suivi', auth.currentUser?.uid || ''),
      { [today]: percentage },
      { merge: true }
    );
  };

  return (
    <View className="flex-1 bg-secondary p-4">
      <Text className="text-lg font-bold mb-4">Programme de la semaine</Text>
      {programme ? (
        Object.entries(programme.days || {}).map(([day, ex]) => (
          <View
            key={day}
            className="flex-row justify-between items-center mb-2"
          >
            <Text>{day} : {ex}</Text>
            <Switch
              value={completedDays[day]}
              onValueChange={(v) => handleToggle(day, v)}
              trackColor={{ true: '#1C3F39', false: '#767577' }}
              thumbColor={completedDays[day] ? '#EEE7D3' : '#f4f3f4'}
            />
          </View>
        ))
      ) : (
        <Text>Aucun programme assigné</Text>
      )}
      <Button
        mode="contained"
        style={{ backgroundColor: '#1C3F39', marginTop: 20 }}
        onPress={() => router.push('/(patient)/Appointments')}
      >
        Mes rendez-vous
      </Button>
      <Button
        mode="contained"
        style={{ backgroundColor: '#1C3F39', marginTop: 10 }}
        onPress={() =>
          Notifications.scheduleNotificationAsync({
            content: { title: 'Test', body: 'Notification locale' },
            trigger: null,
          })
        }
      >
        Tester la notification
      </Button>
    </View>
  );
}
