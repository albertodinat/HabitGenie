import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { auth, db } from '../firebase.config';
import { doc, setDoc } from 'firebase/firestore';

export default function usePushToken() {
  useEffect(() => {
    const register = async () => {
      if (!Device.isDevice) return;
      const { status: existing } = await Notifications.getPermissionsAsync();
      let final = existing;
      if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        final = status;
      }
      if (final !== 'granted') return;
      const tokenData = await Notifications.getExpoPushTokenAsync();
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      await setDoc(
        doc(db, 'users', uid),
        { pushToken: tokenData.data },
        { merge: true }
      );
    };
    register();
  }, []);
}
