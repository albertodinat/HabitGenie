import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Switch, Button } from 'react-native-paper';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase.config';
import { router } from 'expo-router';

export default function NotificationPreferences() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, 'users', auth.currentUser?.uid || ''));
      setEnabled(!!snap.data()?.notificationEnabled);
    };
    fetch();
  }, []);

  const toggle = async () => {
    const newVal = !enabled;
    setEnabled(newVal);
    await setDoc(doc(db, 'users', auth.currentUser?.uid || ''), { notificationEnabled: newVal }, { merge: true });
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary p-4">
      <Text className="text-lg mb-4">Notifications de rappel</Text>
      <View className="flex-row items-center mb-4">
        <Text>Activer</Text>
        <Switch value={enabled} onValueChange={toggle} />
      </View>
      <Button mode="contained" onPress={() => router.back()} style={{ backgroundColor: '#1C3F39' }}>
        Fermer
      </Button>
    </SafeAreaView>
  );
}
