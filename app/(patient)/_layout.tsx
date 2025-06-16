import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { auth, db } from '../../firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { router } from 'expo-router';

export default function PatientLayout() {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.replace('/(auth)/HeroPage');
        return;
      }
      const snap = await getDoc(doc(db, 'users', user.uid));
      const role = snap.data()?.role;
      if (role !== 'patient') {
        router.replace('/');
        return;
      }
      setAuthorized(true);
    };
    verify();
  }, []);

  if (!authorized) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" />
    </Stack>
  );
}
