import { View, Text } from "react-native";
import React from "react";
import { Box, Center, Flex, Spacer } from "native-base";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Habit } from "../app/interfaces/habits";

interface DailyProgressComponentProps {
  averagePercentage: number;
  completedHabits: number;
  habits: Habit[];
}

const DailyProgressComponent = ({
  averagePercentage,
  completedHabits,
  habits,
}: DailyProgressComponentProps) => {
  return (
    <Center className="mx-3 pt-3">
      <Flex
        direction="row"
        align="center"
        justify="center"
        className="bg-primary rounded-3xl w-full h-24 shadow-md shadow-black"
      >
        <Center className="rounded-full p-2 w-[60px] h-[60px] mr-6">
          <AnimatedCircularProgress
            size={50}
            width={3}
            fill={averagePercentage}
            tintColor="#EEE7D3"
            backgroundColor="#3d5875"
            rotation={0}
          >
            {() => (
              <Text
                className="text-base text-secondary font-bold"
                numberOfLines={1}
              >
                {averagePercentage}%
              </Text>
            )}
          </AnimatedCircularProgress>
        </Center>
        <Box>
          <Text className="text-base text-secondary">
            Your daily goals are almost done! 🔥
          </Text>
          <Text className="text-base text-secondary">
            {completedHabits} of {habits.length} completed
          </Text>
        </Box>
      </Flex>
      <Flex className="w-[100%] mt-4 px-1 mb-3">
        <Box className="flex flex-row">
          <Text className="text-base text-primary">Habits</Text>
          <Spacer />
          <TouchableOpacity>
            <Text className="text-base text-[#368067]">Mark all as done</Text>
          </TouchableOpacity>
        </Box>
      </Flex>
    </Center>
  );
};

export default DailyProgressComponent;
