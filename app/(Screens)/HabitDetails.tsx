import { Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { Habit } from "../interfaces/habits";
import { SafeAreaView } from "react-native-safe-area-context";
import HabitDetailsPage from "./HabitDetailsPage";

const HabitDetails = () => {
  const { habitId } = useLocalSearchParams();
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [showLoader, setShowLoader] = useState(true);
  const docRef = doc(db, "Habits", `${habitId}`);

  useEffect(() => {
    getDoc(docRef)
      .then((data) => {
        setSelectedHabit(data.data() as Habit);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      })
      .finally(() => {
        setShowLoader(false);
      });
  }, []);

  return (
    <SafeAreaView className="h-full bg-secondary">
      {showLoader ? (
        <Text>Loading...</Text>
      ) : selectedHabit ? (
        <HabitDetailsPage selectedHabit={selectedHabit} habitId={habitId as string} />
      ) : (
        <Text>No habit found</Text>
      )}
    </SafeAreaView>
  );
};

export default HabitDetails;
