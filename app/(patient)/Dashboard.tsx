import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { db, auth } from '../../firebase.config';
import { doc, getDoc } from 'firebase/firestore';

export default function Dashboard() {
  const [programme, setProgramme] = useState<any>(null);

  useEffect(() => {
    const fetchProgramme = async () => {
      const snap = await getDoc(doc(db, 'programmes', auth.currentUser?.uid || ''));
      setProgramme(snap.data());
    };
    fetchProgramme();
  }, []);

  return (
    <View className="flex-1 bg-secondary p-4">
      <Text className="text-lg font-bold mb-4">Programme de la semaine</Text>
      {programme ? (
        Object.entries(programme.days || {}).map(([day, ex]) => (
          <Text key={day}>{day} : {ex}</Text>
        ))
      ) : (
        <Text>Aucun programme assigné</Text>
      )}
    </View>
  );
}
