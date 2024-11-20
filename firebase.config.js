// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// import getReactNativePersistence from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Secrets from './Secrets.json';
import Config from "react-native-config";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: Secrets.API_KEY,
  authDomain: Secrets.AUTH_DOMAIN,
  projectId: Secrets.PROJECT_ID,
  storageBucket: Secrets.STORAGE_BUCKET,
  messagingSenderId: Secrets.MESSAGING_SENDER_ID,
  appId: Secrets.APP_ID,
  measurementId: Secrets.MEASUREMENT_ID,
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
