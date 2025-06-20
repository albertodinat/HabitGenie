import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { auth, db } from '../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface RoleGuardProps {
  role: 'orthophonist' | 'patient';
  children: React.ReactNode;
}

export default function RoleGuard({ role, children }: RoleGuardProps) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/(auth)/HeroPage');
        return;
      }
      const snap = await getDoc(doc(db, 'users', user.uid));
      const userRole = snap.data()?.role;
      if (userRole !== role) {
        router.replace(
          userRole === 'orthophonist'
            ? '/(orthophonist)/Dashboard'
            : '/(patient)/Dashboard'
        );
        setAllowed(false);
      } else {
        setAllowed(true);
      }
    });
    return unsub;
  }, [role]);

  if (!allowed) return <View />;

  return <>{children}</>;
}
