import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// import getReactNativePersistence from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import Secrets from './Secrets.json';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully!");
    router.replace("/HeroPage");
  } catch (error) {
    console.error("Logout error:", error.message);
  }
};
export const db = getFirestore(app);
