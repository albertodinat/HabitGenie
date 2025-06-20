import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { db, auth } from '../../firebase.config';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface Patient {
  id: string;
  name: string;
}

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'patient'),
        where('orthophonistId', '==', auth.currentUser?.uid)
      );
      const snap = await getDocs(q);
      const list: Patient[] = [];
      snap.forEach((d) => list.push({ id: d.id, name: d.data().name }));
      setPatients(list);
    };
    fetchPatients();
  }, []);

  return (
    <View className="flex-1 bg-secondary p-4">
      <Text className="text-lg font-bold mb-4">Mes Patients</Text>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-3 bg-primary mb-2 rounded-xl">
            <Text className="text-secondary">{item.name}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Aucun patient</Text>}
      />
    </View>
  );
}
