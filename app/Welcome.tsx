import React from 'react';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { router } from 'expo-router';

export default function Welcome() {
  return (
    <SafeAreaView className="flex-1 bg-secondary items-center justify-center p-4">
      <Image source={require('../assets/images/icon.png')} style={{ width: 120, height: 120 }} />
      <Text className="text-primary text-xl font-bold mt-4 text-center">
        Une séance chaque jour, c’est un pas de plus
      </Text>
      <View className="mt-8 w-full">
        <CustomButton
          title="Commencer"
          handlePress={() => router.replace('/(auth)/HeroPage')}
          ContainerStyles="w-full rounded-3xl"
          textStyles="text-secondary"
          isLoading={false}
        />
      </View>
    </SafeAreaView>
  );
}
