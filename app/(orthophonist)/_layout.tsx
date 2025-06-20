import React from 'react';
import { Stack } from 'expo-router';

export default function OrthophonistLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" />
      <Stack.Screen name="CreateProgramme" />
      <Stack.Screen name="PatientDetails" />
      <Stack.Screen name="Appointments" />
      <Stack.Screen name="CreateAppointment" />
      <Stack.Screen name="EditAppointment" />
    </Stack>
  );
}
