import { View, Text, RefreshControl } from "react-native";
import React from "react";
import { Box, Center, FlatList, Flex, Spinner } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { assignEmoji } from "../utils/keywordToEmojiMap";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { Habit } from "../app/interfaces/habits";

interface HabitsListProps {
  habits: Habit[];
  isLoading: boolean;
  getData: () => Promise<void>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedHabit: React.Dispatch<React.SetStateAction<Habit | null>>;
}

const HabitsList = ({
  habits,
  isLoading,
  getData,
  setShowModal,
  setSelectedHabit,
}: HabitsListProps) => {
  return (
    <>
      <FlatList
        key="habitId"
        data={habits}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={getData}
            title="Pull to refresh"
            tintColor="green"
            titleColor="green"
          />
        }
        renderItem={({ item: habit }) => (
          <Box key={habit.id}>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/(Screens)/HabitDetails",
                  params: { habitId: habit.id },
                });
              }}
              key={habit.id}
              className="flex flex-row items-center justify-between mb-4 bg-primary rounded-3xl p-4 shadow-md shadow-black mx-3"
            >
              <Box className="flex flex-row items-center justify-center">
                <Box className="mr-2">
                  <AnimatedCircularProgress
                    size={40}
                    width={3}
                    fill={(habit.completed_units / habit.total_units) * 100}
                    tintColor="#EEE7D3"
                    backgroundColor="#3d5875"
                    rotation={0}
                  >
                    {() => (
                      <Text
                        className="text-base text-secondary"
                        numberOfLines={1}
                      >
                        {assignEmoji(habit.name)}
                      </Text>
                    )}
                  </AnimatedCircularProgress>
                </Box>
                <Text
                  numberOfLines={1}
                  className="text-base text-secondary w-44"
                >
                  {habit.name}
                </Text>
              </Box>

              <Box className="flex flex-row items-center justify-center">
                <Text className="text-base mr-4 text-secondary">
                  {habit.completed_units} of {habit.total_units} {habit.uom}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowModal(true);
                    setSelectedHabit(habit);
                  }}
                >
                  <AntDesign size={24} name="pluscircleo" color={"#EEE7D3"} />
                </TouchableOpacity>
              </Box>
            </TouchableOpacity>
          </Box>
        )}
        ListEmptyComponent={
          isLoading ? (
            <></>
          ) : (
            <Center>
              <Flex className="w-full">
                <Box className="flex flex-col px-2">
                  <Text className="text-base text-primary">
                    No habits found.
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      router.push("/(Screens)/CreateHabit");
                    }}
                  >
                    <Text className="text-base text-blue-800">Add Some?</Text>
                  </TouchableOpacity>
                </Box>
              </Flex>
            </Center>
          )
        }
      />
    </>
  );
};

export default HabitsList;
