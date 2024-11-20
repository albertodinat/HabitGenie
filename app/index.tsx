import { View } from "react-native";
import { useEffect, useState } from "react";
import SplashScreen from "./SplashScreen";
import HeroPage from "../app/(auth)/HeroPage";
import { auth } from "../firebase.config";
import HomePage from "../app/(drawer)/(Home)/HomePage";
import React from "react";

export default function Index() {
  const [isShowSplashScreen, setIsShowSplashScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowSplashScreen(false);
    }, 1500);

    return () => clearTimeout(timer); // cleanup on unmount
  }, []);

  return (
    <View className="flex-1">
      {isShowSplashScreen ? <SplashScreen /> : <HeroPage />}
      {/* user ? (
        <HomePage />
      ) : (
        <HeroPage />
      )} */}
    </View>
  );
}
