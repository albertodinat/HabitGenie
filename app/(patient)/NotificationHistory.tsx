import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db, auth } from '../../firebase.config';
import { router } from 'expo-router';

interface Notif { title: string; createdAt: any; }

export default function NotificationHistory() {
  const [notifications, setNotifications] = useState<Notif[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const q = query(collection(db, 'users', auth.currentUser?.uid || '', 'notifications'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list: Notif[] = [];
      snap.forEach(d => list.push({ title: d.data().title, createdAt: d.data().createdAt }));
      setNotifications(list);
    };
    fetch();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-secondary p-4">
      <FlatList
        data={notifications}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View className="p-3 bg-primary mb-2 rounded-xl">
            <Text className="text-secondary">{item.title}</Text>
            <Text className="text-secondary">{new Date(item.createdAt.seconds*1000).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Aucune notification</Text>}
      />
      <Button mode="contained" onPress={() => router.back()} style={{ backgroundColor: '#1C3F39', marginTop: 10 }}>
        Fermer
      </Button>
    </SafeAreaView>
  );
}
