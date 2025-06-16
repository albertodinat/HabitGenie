import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';

const Dashboard = () => (
  <SafeAreaView className="flex-1 items-center justify-center bg-secondary">
    <Text className="text-primary text-xl font-semibold">Orthophonist Dashboard</Text>
  </SafeAreaView>
);

export default Dashboard;
