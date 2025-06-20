import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { router, useLocalSearchParams } from 'expo-router';

const defaultDays = {
  lundi: '',
  mardi: '',
  mercredi: '',
  jeudi: '',
  vendredi: '',
  samedi: '',
  dimanche: '',
};

type DaysState = typeof defaultDays;

const Program = () => {
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const [days, setDays] = useState<DaysState>(defaultDays);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMsg, setShowMsg] = useState(false);

  useEffect(() => {
    const loadProgram = async () => {
      if (!patientId) return;
      try {
        const ref = doc(db, 'programmes', String(patientId));
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as any;
          if (data.days) {
            setDays({ ...defaultDays, ...data.days });
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    loadProgram();
  }, [patientId]);

  const handleChange = (key: keyof DaysState, value: string) => {
    setDays((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!patientId) return;
    setSaving(true);
    try {
      const ref = doc(db, 'programmes', String(patientId));
      await setDoc(ref, { days }, { merge: true });
      setShowMsg(true);
    } catch (e) {
      console.log(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <View />;
  }

  return (
    <ScrollView className="flex-1 bg-secondary p-4">
      {Object.keys(days).map((d) => (
        <TextInput
          key={d}
          label={d.charAt(0).toUpperCase() + d.slice(1)}
          value={days[d as keyof DaysState]}
          onChangeText={(text) => handleChange(d as keyof DaysState, text)}
          mode="outlined"
          style={{ marginBottom: 8, backgroundColor: '#EEE7D3' }}
        />
      ))}
      <Button mode="contained" onPress={handleSave} loading={saving} style={{ marginTop: 16 }}>
        Sauvegarder
      </Button>
      <Button onPress={() => router.back()} style={{ marginTop: 8 }}>
        Retour
      </Button>
      <Snackbar visible={showMsg} onDismiss={() => setShowMsg(false)} duration={2000}>
        Programme sauvegardé !
      </Snackbar>
    </ScrollView>
  );
};

export default Program;
