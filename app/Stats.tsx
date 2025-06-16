import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { db } from '../firebase.config';
import { collection, getDocs } from 'firebase/firestore';

interface SuiviData {
  date: string;
  completion: number;
}

export default function Stats() {
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const [data, setData] = useState<SuiviData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!patientId) return;
      const colRef = collection(db, 'suivi', String(patientId));
      const snap = await getDocs(colRef);
      const arr: SuiviData[] = [];
      snap.forEach((d) => {
        arr.push({ date: d.id, completion: d.data().completion ?? 0 });
      });
      setData(arr);
    };
    fetchData();
  }, [patientId]);

  return (
    <SafeAreaView className="flex-1 bg-secondary p-4">
      <Text className="text-primary text-xl font-semibold mb-4">
        Stats for {patientId}
      </Text>
      {data.map((d) => (
        <Text key={d.date} className="text-primary">
          {d.date}: {d.completion}%
        </Text>
      ))}
    </SafeAreaView>
  );
}
