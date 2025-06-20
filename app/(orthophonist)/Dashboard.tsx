import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { router } from 'expo-router';
import { Patient } from '../interfaces/patient';

const Dashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const snap = await getDocs(collection(db, 'patients'));
        const list: Patient[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Patient, 'id'>) }));
        setPatients(list);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  return (
    <View className="flex-1 bg-secondary p-4">
      <Text className="text-lg font-bold mb-4 text-primary">Patients</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({ pathname: '/(orthophonist)/Program', params: { patientId: item.id } })
              }
              className="p-3 bg-primary rounded-md mb-2"
            >
              <Text className="text-secondary text-lg">{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default Dashboard;
