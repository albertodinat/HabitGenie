import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db, handleLogout } from '../../firebase.config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect } from 'react';

export default function Profile() {
  const [name, setName] = useState(auth.currentUser?.displayName || '');
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    const loadRole = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const snap = await getDoc(doc(db, 'users', uid));
      setRole(snap.data()?.role || '');
    };
    loadRole();
  }, []);

  const onSave = async () => {
    const user = auth.currentUser;
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid), { name });
    await user.updateProfile({ displayName: name });
    Alert.alert('Updated', 'Name updated successfully');
  };

  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: handleLogout },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary p-4">
      <Text className="text-primary text-2xl font-semibold mb-4">Profile</Text>
      <View className="mb-4">
        <Text className="text-primary">Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          className="border p-2 rounded-md bg-white"
        />
        <TouchableOpacity onPress={onSave} className="mt-2">
          <Text className="text-primary underline">Save</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-primary mb-2">Email: {auth.currentUser?.email}</Text>
      <Text className="text-primary mb-8">Role: {role || 'none'}</Text>
      <TouchableOpacity onPress={confirmLogout} className="bg-primary p-3 rounded-md">
        <Text className="text-secondary text-center">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
