import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';

interface Programme {
  days?: { [day: string]: string };
}

export default function PatientDetails() {
  const { patientId } = useLocalSearchParams<{ patientId?: string }>();
  const [name, setName] = useState('');
  const [programme, setProgramme] = useState<Programme | null>(null);
  const [suivi, setSuivi] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!patientId) return;
      const [userSnap, progSnap, suiviSnap] = await Promise.all([
        getDoc(doc(db, 'users', patientId as string)),
        getDoc(doc(db, 'programmes', patientId as string)),
        getDoc(doc(db, 'suivi', patientId as string)),
      ]);
      setName((userSnap.data()?.name as string) || '');
      setProgramme(progSnap.data() as Programme);
      setSuivi(suiviSnap.data());
    };
    fetchData();
  }, [patientId]);

  return (
    <View className="flex-1 bg-secondary p-4">
      <Text className="text-lg font-bold mb-4">{name}</Text>
      <Text className="text-base font-bold mb-2">Programme actuel</Text>
      {programme ? (
        Object.entries(programme.days || {}).map(([day, ex]) => (
          <Text key={day} className="text-base">
            {day} : {ex}
          </Text>
        ))
      ) : (
        <Text>Aucun programme</Text>
      )}
      <Text className="text-base font-bold mt-4 mb-2">
        Taux d’accomplissement journalier
      </Text>
      {suivi ? (
        Object.entries(suivi).map(([date, rate]) => (
          <Text key={date} className="text-base">
            {date} : {String(rate)}
          </Text>
        ))
      ) : (
        <Text>Aucun suivi</Text>
      )}
      <Button
        mode="contained"
        style={{ backgroundColor: '#1C3F39', marginTop: 20 }}
        onPress={() =>
          router.push({
            pathname: '/(orthophonist)/CreateProgramme',
            params: { patientId },
          })
        }
      >
        Modifier programme
      </Button>
    </View>
  );
}
