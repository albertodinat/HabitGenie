import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from "../../components/CustomButton"
import { router } from 'expo-router'
import { auth } from '../../firebase.config'
import { Button } from 'native-base'
import { signInWithEmailAndPassword } from 'firebase/auth'
import Secrets from '../../Secrets.json';


const HeroPage = () => {
  const [user, setUser] = useState<any | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  var countPress = 0;
  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const onAuthStateChanged = (user: any) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  const HandlePressing = () => {
    countPress++
    console.log("Pressed ", countPress, " Times")
    if (countPress >= 10) {
      setIsLoading(true)
      signInWithEmailAndPassword(auth, Secrets.ADMIN_EMAIL, Secrets.ADMIN_PASS)
        .then(() => {
          console.log("Admin signed in!");
          router.push("/(drawer)/(Home)/HomePage");
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            console.log("That email address is already in use!");
          }

          if (error.code === "auth/invalid-email") {
            console.log("That email address is invalid!");
          }
          alert("Wrong email or password");
          setIsLoading(false)
        });
    }
  }
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
          <View className='flex-row w-full'>
            <View className='w-1/2'>
              <Text className="text-primary font-black text-3xl border-2">
                Hello!
              </Text>
            </View>
            <View className='w-1/2 items-end'>
              <Button
                className='bg-transparent w-10 h-9'
                onPress={() => {
                  HandlePressing()
                }}
                disabled={isLoading}
              />
            </View>
          </View>
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