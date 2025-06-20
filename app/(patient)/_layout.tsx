import React from 'react';
import { Stack } from 'expo-router';
import RoleGuard from '../../components/RoleGuard';

export default function PatientLayout() {
  return (
    <RoleGuard role="patient">
      <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" />
      <Stack.Screen name="Appointments" />
      <Stack.Screen name="NotificationPreferences" />
      <Stack.Screen name="NotificationHistory" />
      </Stack>
    </RoleGuard>
  );
}
