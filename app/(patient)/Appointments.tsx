import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { db, auth } from '../../firebase.config';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

interface Appointment {
  id: string;
  date: string;
  time: string;
  lieu: string;
  motif: string;
  orthophonistId: string;
  orthophonistName: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!auth.currentUser) return;
      const q = query(
        collection(db, 'rendezvous'),
        where('patientId', '==', auth.currentUser.uid)
      );
      const snap = await getDocs(q);
      const list: Appointment[] = [];
      for (const s of snap.docs) {
        const data = s.data();
        const orthoSnap = await getDoc(doc(db, 'users', data.orthophonistId));
        list.push({
          id: s.id,
          date: data.date,
          time: data.time,
          lieu: data.lieu,
          motif: data.motif || '',
          orthophonistId: data.orthophonistId,
          orthophonistName: orthoSnap.data()?.name || '',
        });
      }
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const today = new Date().setHours(0, 0, 0, 0);
      setAppointments(list.filter((a) => new Date(a.date).getTime() >= today));
    };
    fetchAppointments();
  }, []);

  return (
    <View className="flex-1 bg-secondary p-4">
      <Text className="text-lg font-bold mb-4">Mes rendez-vous</Text>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            className="p-3 mb-2 rounded-xl"
            style={{
              backgroundColor:
                new Date(item.date).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 &&
                new Date(item.date).getTime() - Date.now() > 0
                  ? '#d4f0d2'
                  : '#1C3F39',
            }}
          >
            <Text className="text-secondary">
              {item.date} {item.time}
            </Text>
            <Text className="text-secondary">Lieu : {item.lieu}</Text>
            <Text className="text-secondary">Motif : {item.motif}</Text>
            <Text className="text-secondary">
              Orthophoniste : {item.orthophonistName}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text>Aucun rendez-vous à venir</Text>}
      />
    </View>
  );
}
