import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Switch, Button } from 'react-native-paper';
import { useThemeScheme } from '../Contexts/ThemeContext';
import { router } from 'expo-router';

export default function Settings() {
  const { scheme, toggle } = useThemeScheme();

  return (
    <SafeAreaView className="flex-1 bg-secondary p-4">
      <View className="flex-row items-center mb-4">
        <Text>Thème sombre</Text>
        <Switch value={scheme === 'dark'} onValueChange={toggle} />
      </View>
      <Button mode="contained" onPress={() => router.back()} style={{ backgroundColor: '#1C3F39' }}>
        Fermer
      </Button>
    </SafeAreaView>
  );
}
