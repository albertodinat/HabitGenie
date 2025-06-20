import React, { useEffect, useState } from 'react';
import { View, Text, Alert, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { Select, Box } from 'native-base';
import { router } from 'expo-router';
import { db, auth } from '../../firebase.config';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';

interface Appointment {
  id: string;
  date: string;
  time: string;
  lieu: string;
  motif: string;
  patientId: string;
  patientName: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<{ id: string; name: string }[]>([]);
  const [filterPatient, setFilterPatient] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showPast, setShowPast] = useState(false);

  const fetchAppointments = async () => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, 'rendezvous'),
      where('orthophonistId', '==', auth.currentUser.uid)
    );
    const snap = await getDocs(q);
    const list: Appointment[] = [];
    for (const s of snap.docs) {
      const data = s.data();
      const patientSnap = await getDoc(doc(db, 'users', data.patientId));
      list.push({
        id: s.id,
        date: data.date,
        time: data.time,
        lieu: data.lieu,
        motif: data.motif || '',
        patientId: data.patientId,
        patientName: patientSnap.data()?.name || '',
      });
    }
    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setAppointments(list);

    const pq = query(
      collection(db, 'users'),
      where('role', '==', 'patient'),
      where('orthophonistId', '==', auth.currentUser.uid)
    );
    const pSnap = await getDocs(pq);
    const plist: { id: string; name: string }[] = [];
    pSnap.forEach((d) => plist.push({ id: d.id, name: d.data().name }));
    setPatients(plist);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDelete = async (id: string) => {
    Alert.alert('Supprimer', 'Confirmer la suppression ?', [
      {
        text: 'Annuler',
        style: 'cancel',
      },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, 'rendezvous', id));
          setAppointments((prev) => prev.filter((a) => a.id !== id));
        },
      },
    ]);
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchPatient = !filterPatient || a.patientId === filterPatient;
    const matchDate = !filterDate || a.date === filterDate;
    const isPast = new Date(a.date).getTime() < new Date().setHours(0,0,0,0);
    const matchPast = showPast ? isPast : !isPast;
    return matchPatient && matchDate && matchPast;
  });

  return (
    <SafeAreaView className="flex-1 bg-secondary p-4">
      <Button
        mode="contained"
        onPress={() => router.push('/(orthophonist)/CreateAppointment')}
        style={{ backgroundColor: '#1C3F39', marginBottom: 10 }}
      >
        Nouveau rendez-vous
      </Button>
      <Text className="text-lg font-bold mb-4">Mes rendez-vous</Text>
      <Box className="mb-2 bg-secondary">
        <Select
          placeholder="Filtrer par patient"
          selectedValue={filterPatient || undefined}
          onValueChange={(v) => setFilterPatient(v)}
          borderColor="#1C3F39"
          borderWidth={2}
          borderRadius={6}
          dropdownIconPosition="right"
        >
          <Select.Item label="Tous" value="" />
          {patients.map((p) => (
            <Select.Item key={p.id} label={p.name} value={p.id} />
          ))}
        </Select>
      </Box>
      <TextInput
        placeholder="AAAA-MM-JJ"
        value={filterDate}
        onChangeText={setFilterDate}
        style={{ borderColor: '#1C3F39', borderWidth: 1, borderRadius: 6, padding: 8, marginBottom: 10 }}
      />
      <View className="flex-row mb-2">
        <Button mode="contained" style={{backgroundColor:'#1C3F39'}} onPress={() => setShowPast(false)}>
          À venir
        </Button>
        <View style={{width:10}} />
        <Button mode="contained" style={{backgroundColor:'#1C3F39'}} onPress={() => setShowPast(true)}>
          Passés
        </Button>
      </View>
      <FlatList
        data={filteredAppointments}
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
            <Text className="text-secondary">Patient : {item.patientName}</Text>
            <View className="flex-row mt-2 space-x-2">
              <Button
                mode="contained"
                style={{ backgroundColor: '#1C3F39' }}
                onPress={() =>
                  router.push({
                    pathname: '/(orthophonist)/EditAppointment',
                    params: { id: item.id },
                  })
                }
              >
                Modifier
              </Button>
              <Button
                mode="contained"
                style={{ backgroundColor: '#1C3F39' }}
                onPress={() => handleDelete(item.id)}
              >
                Supprimer
              </Button>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>Aucun rendez-vous</Text>}
      />
    </SafeAreaView>
  );
}
