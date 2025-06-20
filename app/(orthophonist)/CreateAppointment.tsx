import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button } from 'react-native-paper';
import { Select, Box } from 'native-base';
import { router } from 'expo-router';
import { db, auth } from '../../firebase.config';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

interface Patient {
  id: string;
  name: string;
}

export default function CreateAppointment() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [lieu, setLieu] = useState('');
  const [saving, setSaving] = useState(false);

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

  const handleCreate = async () => {
    if (!selectedPatient || !date || !time || !lieu) {
      Alert.alert('Veuillez remplir tous les champs');
      return;
    }
    try {
      setSaving(true);
      await addDoc(collection(db, 'rendezvous'), {
        patientId: selectedPatient,
        orthophonistId: auth.currentUser?.uid,
        date,
        time,
        lieu,
      });
      Alert.alert('Rendez-vous créé');
      router.back();
    } catch (e) {
      Alert.alert('Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary p-4">
      <ScrollView>
        <Text className="text-lg font-bold mb-4">Créer un rendez-vous</Text>
        <Box className="mb-4 bg-secondary">
          <Select
            placeholder="Choisir un patient"
            selectedValue={selectedPatient || undefined}
            onValueChange={(v) => setSelectedPatient(v)}
            borderColor="#1C3F39"
            borderWidth={2}
            borderRadius={6}
            dropdownIconPosition="right"
          >
            {patients.map((p) => (
              <Select.Item key={p.id} label={p.name} value={p.id} />
            ))}
          </Select>
        </Box>
        <TextInput
          label="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          mode="outlined"
          className="mb-2 bg-secondary"
          outlineColor="#1C3F39"
          activeOutlineColor="#1C3F39"
        />
        <TextInput
          label="Heure"
          value={time}
          onChangeText={setTime}
          mode="outlined"
          className="mb-2 bg-secondary"
          outlineColor="#1C3F39"
          activeOutlineColor="#1C3F39"
        />
        <TextInput
          label="Lieu"
          value={lieu}
          onChangeText={setLieu}
          mode="outlined"
          className="mb-2 bg-secondary"
          outlineColor="#1C3F39"
          activeOutlineColor="#1C3F39"
        />
        <Button
          mode="contained"
          onPress={handleCreate}
          loading={saving}
          disabled={saving}
          style={{ backgroundColor: '#1C3F39', marginTop: 10 }}
        >
          Créer
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
