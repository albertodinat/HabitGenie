import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button } from 'react-native-paper';
import { Select, Box } from 'native-base';
import { db, auth } from '../../firebase.config';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';

interface Patient {
  id: string;
  name: string;
}

export default function CreateProgramme() {
  const { patientId } = useLocalSearchParams<{ patientId?: string }>();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [days, setDays] = useState({
    lundi: '',
    mardi: '',
    mercredi: '',
    jeudi: '',
    vendredi: '',
    samedi: '',
    dimanche: '',
  });
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
      if (patientId) {
        setSelectedPatient(patientId as string);
      }
    };
    fetchPatients();
  }, []);

  const handleChange = (key: keyof typeof days, value: string) => {
    setDays({ ...days, [key]: value });
  };

  const handleSave = async () => {
    if (!selectedPatient) {
      Alert.alert('Veuillez sélectionner un patient');
      return;
    }
    try {
      setSaving(true);
      await setDoc(doc(db, 'programmes', selectedPatient), { days });
      Alert.alert('Programme sauvegardé');
      router.back();
    } catch (e) {
      Alert.alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary p-4">
      <ScrollView>
        <Text className="text-lg font-bold mb-4">Créer un programme</Text>
        <Box className="mb-4 bg-secondary">
          <Select
            placeholder="Choisir un patient"
            selectedValue={selectedPatient || undefined}
            onValueChange={(v) => setSelectedPatient(v)}
            borderColor="#1C3F39"
            borderWidth={2}
            borderRadius={6}
            dropdownIconPosition="right"
            isDisabled={!!patientId}
          >
            {patients.map((p) => (
              <Select.Item key={p.id} label={p.name} value={p.id} />
            ))}
          </Select>
        </Box>
        {Object.entries(days).map(([day, value]) => (
          <TextInput
            key={day}
            label={day.charAt(0).toUpperCase() + day.slice(1)}
            value={value}
            onChangeText={(text) => handleChange(day as keyof typeof days, text)}
            mode="outlined"
            className="mb-2 bg-secondary"
            outlineColor="#1C3F39"
            activeOutlineColor="#1C3F39"
          />
        ))}
        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          style={{ backgroundColor: '#1C3F39', marginTop: 10 }}
        >
          Enregistrer
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
