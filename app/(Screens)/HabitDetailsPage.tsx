import { View, Text, Touchable, TouchableOpacity } from "react-native";
import React from "react";
import { Habit } from "../interfaces/habits";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box, ScrollView } from "native-base";
import { IoCloseOutline, IoPencilOutline } from "react-icons/io5";
import { auth } from "../../firebase.config";
import CircularProgress from "react-native-circular-progress-indicator";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";

const HabitDetailsPage = ({
  selectedHabit,
  habitId,
}: {
  selectedHabit: Habit;
  habitId: string;
}) => {
  console.log(habitId);
  const rand = Math.floor(Math.random() * 100);
  return (
    // <SafeAreaView className="h-full bg-secondary border-2">
    <ScrollView className="w-full">
      <Box className="w-[93%] ml-auto mr-auto pt-4">
        <Box className="flex flex-row items-center justify-between">
          <TouchableOpacity
            className="w-8 h-8 items-center justify-center -ml-2"
            onPress={() => {
              router.back();
            }}
          >
            <AntDesign name="left" size={18} color="#1c3f39" />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-8 h-8 items-center justify-center"
            onPress={() => {
              router.push({
                pathname: "/EditHabit",
                params: { habitId: habitId },
              });
            }}
          >
            <AntDesign name="edit" size={18} color="#1c3f39" />
          </TouchableOpacity>
        </Box>
        <Box className="mt-2">
          <Text className="text-lg font-bold">
            Hey {auth.currentUser?.displayName}!
          </Text>
          <Text className="text-lg">
            Your habit journey with{" "}
            <Text className="text-[#378b7d] font-semibold">
              {selectedHabit.name}!
            </Text>
          </Text>
        </Box>
        <Box className="w-full h-64 items-center justify-center bg-primary rounded-3xl shadow-md shadow-black"></Box>
        <Box>
          <Box className="flex flex-row items-center justify-between mt-6">
            <Box className="w-[48%] h-44 bg-primary rounded-3xl flex flex-col items-center justify-between shadow-md shadow-black">
              <Box className="mt-4">
                <CircularProgress value={rand} valueSuffix="%" />
              </Box>
              <Text className="text-md text-secondary text-center mb-3">
                8/12 l
              </Text>
            </Box>
            <Box className="w-[48%] h-44 bg-primary rounded-3xl flex flex-col items-center justify-between shadow-md shadow-black">
              <Text className="text-lg text-secondary text-center mt-3">
                Current Streak
              </Text>
              <Text className="text-5xl text-secondary text-center">8🔥</Text>
              <Text className="text-md text-secondary text-center mb-3">
                You're doing well!
              </Text>
            </Box>
          </Box>
          <Box className="flex flex-row items-center justify-between mt-6 shadow-md shadow-black">
            <Box className="w-[48%] h-44 bg-primary rounded-3xl flex flex-col items-center justify-between">
              <Text className="text-lg text-secondary text-center mt-3">
                Progress
              </Text>
              <Text className="text-lg text-secondary text-center mb-12">
                idhar graph daalege
              </Text>
            </Box>
            <Box className="w-[48%] h-44 bg-primary rounded-3xl flex flex-col items-center justify-between">
              <Text className="text-lg text-secondary text-center mt-3">
                Next reminder in
              </Text>
              <Text className="text-4xl text-secondary text-center mb-12">
                6h 12m
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </ScrollView>
    // </SafeAreaView>
  );
};

export default HabitDetailsPage;
