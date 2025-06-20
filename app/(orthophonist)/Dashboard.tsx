import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';
import { db, auth } from '../../firebase.config';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';

interface Patient {
  id: string;
  name: string;
}

export default function Dashboard() {
  const [firstName, setFirstName] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const snapUser = await getDoc(doc(db, 'users', uid));
        setFirstName(snapUser.data()?.name?.split(' ')[0] || '');
      }
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
      {firstName ? (
        <Text className="text-lg font-bold mb-2">Bonjour {firstName} !</Text>
      ) : null}
      <Button
        mode="contained"
        style={{ backgroundColor: '#1C3F39', marginBottom: 10 }}
        onPress={() => router.push('/(orthophonist)/CreateProgramme')}
      >
        Créer un programme
      </Button>
      <Text className="text-lg font-bold mb-4">Mes Patients</Text>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-3 bg-primary mb-2 rounded-xl flex-row justify-between items-center">
            <Text className="text-secondary">{item.name}</Text>
            <Button
              mode="contained"
              style={{ backgroundColor: '#1C3F39' }}
              onPress={() =>
                router.push({
                  pathname: '/(orthophonist)/PatientDetails',
                  params: { patientId: item.id },
                })
              }
            >
              Voir
            </Button>
          </View>
        )}
        ListEmptyComponent={<Text>Aucun patient</Text>}
      />
      <Button mode="contained" style={{ backgroundColor: '#1C3F39', marginTop: 10 }} onPress={() => router.push('/(Screens)/Settings')}>
        Paramètres
      </Button>
    </View>
  );
}
