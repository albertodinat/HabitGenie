import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const AuthLayout = () => {
  return (
    <>
      <Stack>
      <Stack.Screen
          name='HeroPage'
          options={{
            headerShown: false,
            animation: 'fade_from_bottom'
          }}
        />
        <Stack.Screen
          name='SignUp'
          options={{
            headerShown: false,
            animation:'fade'
          }}
        />
        <Stack.Screen
          name='SignIn'
          options={{
            headerShown: false,
            animation:'fade'
          }}
        />
      </Stack>
      <StatusBar
        style='light'
      />
    </>
  )
}

export default AuthLayout