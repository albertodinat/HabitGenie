import React from 'react';
import { Stack } from 'expo-router';

export default function PatientLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" />
      <Stack.Screen name="Appointments" />
    </Stack>
  );
}
