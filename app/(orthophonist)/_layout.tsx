import React from 'react';
import { Stack } from 'expo-router';
import RoleGuard from '../../components/RoleGuard';

export default function OrthophonistLayout() {
  return (
    <RoleGuard role="orthophonist">
      <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" />
      <Stack.Screen name="CreateProgramme" />
      <Stack.Screen name="PatientDetails" />
      <Stack.Screen name="Appointments" />
      <Stack.Screen name="CreateAppointment" />
      <Stack.Screen name="EditAppointment" />
      </Stack>
    </RoleGuard>
  );
}
