import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from "../../components/CustomButton"
import { router } from 'expo-router'
import { auth } from '../../firebase.config'

const HeroPage = () => {
  const [user, setUser] = useState<any | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const onAuthStateChanged = (user: any) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    if (user) {
      router.replace("/(Home)/HomePage");
    }
  }, [user]); // Trigger navigation only after `user` changes

  if (initializing) return null; // Add a loading state if needed

  return (
    <SafeAreaView className="bg-secondary h-full">
      <View className="h-1/2 items-center justify-center">
        <Image
          source={require('../../assets/images/Cover3.png')}
          className='w-full justify-center'
          resizeMode="contain"
        />
      </View>
      <View className="px-4">
        <View className="flex flex-col items-start justify-center p-2 w-full">
          <Text className="text-primary font-black text-3xl">
            Hello!
          </Text>
          <Text className="text-primary text-xl font-semibold">
            Create your Account or Log In if you have one.
          </Text>
        </View>
        <View className="flex flex-col items-center justify-center w-full px-2 my-1">
          <Text className="text-primary text-xl font-semibold my-2">
            Get Started?
          </Text>
          <CustomButton
            title={"Login"}
            handlePress={() => { router.replace("../../(auth)/SignIn") }}
            ContainerStyles={"w-full px-2 rounded-3xl"}
            textStyles={"text-secondary"}
            isLoading={false}
          />
          <CustomButton
            title={"Sign Up"}
            handlePress={() => { router.replace("../../(auth)/SignUp") }}
            ContainerStyles={"w-full px-2 my-5 rounded-3xl border-2 border-primary bg-secondary"}
            textStyles={"text-primary"}
            isLoading={false}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default HeroPage;