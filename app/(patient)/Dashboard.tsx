import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Alert } from 'react-native';
import { Button, Modal, Portal, TextInput as PaperInput } from 'react-native-paper';
import { router } from 'expo-router';
import { db, auth } from '../../firebase.config';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import dayjs from 'dayjs';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { sendPushNotification } from '../../utils/sendNotification';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function Dashboard() {
  const [firstName, setFirstName] = useState('');
  const [programme, setProgramme] = useState<any>(null);
  const [completedDays, setCompletedDays] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [progressData, setProgressData] = useState<{ date: string; rate: number }[]>([]);
  const [commentDay, setCommentDay] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

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
        const snap = await getDoc(doc(db, 'users', uid));
        setFirstName(snap.data()?.name?.split(' ')[0] || '');
      }

      sub = Notifications.addNotificationReceivedListener((notification) => {
        const title = notification.request.content.title || 'Notification';
        const body = notification.request.content.body || '';
        Alert.alert(title, body);
        const uid = auth.currentUser?.uid;
        if (uid) {
          setDoc(
            collection(db, 'users', uid, 'notifications'),
            { title, createdAt: new Date() }
          );
        }
      });
    };
    register();
    return () => {
      sub?.remove();
    };
  }, []);

  useEffect(() => {
    const loadName = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const snap = await getDoc(doc(db, 'users', uid));
      setFirstName(snap.data()?.name?.split(' ')[0] || '');
    };
    loadName();
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

  useEffect(() => {
    const fetchProgress = async () => {
      const snap = await getDoc(doc(db, 'suivi', auth.currentUser?.uid || ''));
      const data = snap.data() || {};
      const entries = Object.entries(data).slice(-7);
      const list = entries.map(([d, r]) => ({ date: d, rate: Number(r) }));
      setProgressData(list);
    };
    fetchProgress();
  }, []);

  const handleToggle = async (day: string, value: boolean) => {
    const updated = { ...completedDays, [day]: value };
    setCompletedDays(updated);
    if (!programme) return;
    if (value) {
      setCommentDay(day);
      return;
    }
    const total = Object.keys(programme.days || {}).length;
    const done = Object.values(updated).filter(Boolean).length;
    const percentage = Math.round((done / total) * 100);
    const today = dayjs().format('YYYY-MM-DD');
    await setDoc(doc(db, 'suivi', auth.currentUser?.uid || ''), { [today]: { rate: percentage } }, { merge: true });
  };

  return (
    <View className="flex-1 bg-secondary p-4">
      {firstName ? (
        <Text className="text-lg font-bold mb-2">Bonjour {firstName} !</Text>
      ) : null}
      {progressData.length > 0 && (
        <LineChart
          data={{
            labels: progressData.map((p) => p.date.slice(5)),
            datasets: [{ data: progressData.map((p) => p.rate) }],
          }}
          width={Dimensions.get('window').width - 32}
          height={200}
          chartConfig={{
            backgroundGradientFrom: '#EEE7D3',
            backgroundGradientTo: '#EEE7D3',
            color: () => '#1C3F39',
          }}
          style={{ marginBottom: 20 }}
        />
      )}
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
      <Button
        mode="contained"
        style={{ backgroundColor: '#1C3F39', marginTop: 10 }}
        onPress={() => router.push('/(patient)/NotificationPreferences')}
      >
        Préférences notifications
      </Button>
      <Button
        mode="contained"
        style={{ backgroundColor: '#1C3F39', marginTop: 10 }}
        onPress={() => router.push('/(patient)/NotificationHistory')}
      >
        Historique notifications
      </Button>
      <Button
        mode="contained"
        style={{ backgroundColor: '#1C3F39', marginTop: 10 }}
        onPress={() => router.push('/(Screens)/Settings')}
      >
        Paramètres
      </Button>
      <Portal>
        <Modal
          visible={commentDay !== null}
          onDismiss={() => {
            setCommentDay(null);
            setCommentText('');
          }}
          contentContainerStyle={{ backgroundColor: '#EEE7D3', padding: 20 }}
        >
          <PaperInput
            label="Commentaire"
            value={commentText}
            onChangeText={setCommentText}
            mode="outlined"
            style={{ marginBottom: 10 }}
          />
          <Button
            mode="contained"
            style={{ backgroundColor: '#1C3F39' }}
          onPress={() => {
              if (commentDay) {
                const updated = { ...completedDays, [commentDay]: true };
                const total = Object.keys(programme?.days || {}).length;
                const done = Object.values(updated).filter(Boolean).length;
                const percentage = Math.round((done / total) * 100);
                const today = dayjs().format('YYYY-MM-DD');
                setDoc(
                  doc(db, 'suivi', auth.currentUser?.uid || ''),
                  { [today]: { rate: percentage, comment: commentText } },
                  { merge: true }
                );
              }
              setCommentText('');
              setCommentDay(null);
            }}
          >
            Valider
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}
