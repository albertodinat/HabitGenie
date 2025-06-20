import { View } from "react-native";
import { useEffect, useState } from "react";
import SplashScreen from "./SplashScreen";
import { auth, db } from "../firebase.config";
import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { router } from "expo-router";
import Welcome from "./Welcome";

export default function Index() {
  const [isShowSplashScreen, setIsShowSplashScreen] = useState(true);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowSplashScreen(false);
    }, 1500);

    return () => clearTimeout(timer); // cleanup on unmount
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, 'users', user.uid));
        const role = snap.data()?.role;
        router.replace(
          role === 'orthophonist'
            ? '/(orthophonist)/Dashboard'
            : '/(patient)/Dashboard'
        );
      }
      setCheckedAuth(true);
    });
    return unsub;
  }, []);

  return (
    <View className="flex-1">
      {isShowSplashScreen ? (
        <SplashScreen />
      ) : checkedAuth ? (
        <Welcome />
      ) : (
        <View />
      )}
      {/* user ? (
        <HomePage />
      ) : (
        <HeroPage />
      )} */}
    </View>
  );
}
