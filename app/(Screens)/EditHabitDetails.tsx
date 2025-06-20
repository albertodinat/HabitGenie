import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box, Button, Center, Flex, Select } from "native-base";
import { TextInput } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { assignEmoji } from "../../utils/keywordToEmojiMap";
import { router } from "expo-router";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase.config";
import { Habit } from "../interfaces/habits";

const EditHabitDetails = ({
  selectedHabit,
  habitId,
}: {
  selectedHabit: Habit;
  habitId: string;
}) => {
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [habitName, setHabitName] = useState(selectedHabit.name);
  const [habitTime, setHabitTime] = useState<string | null>(selectedHabit.time);
  const [habitFrequency, setHabitFrequency] = useState(selectedHabit.frequency);
  const [habitUoM, setHabitUoM] = useState<string | null>(selectedHabit.uom);
  const [habitQuantity, setHabitQuantity] = useState<number | null>(
    selectedHabit.total_units
  );

  const constructHabitPayload = () => {
    if (!validateHabit()) {
      return null;
    }

    const payload = {
      userId: auth.currentUser?.uid,
      name: habitName,
      time: habitTime,
      frequency: habitFrequency,
      uom: habitUoM,
      total_units: habitQuantity,
    };

    return payload;
  };

  const handleUpdateHabit = () => {
    setIsLoading(true);
    const docRef = doc(db, "Habits", `${habitId}`);
    updateDoc(docRef, { ...constructHabitPayload() })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
        router.back();
      });
  };

  const items = [
    {
      label: "Daily",
      value: "daily",
    },
    {
      label: "Weekly",
      value: "weekly",
    },
    {
      label: "Bi-Weekly",
      value: "bi-weekly",
    },
    {
      label: "Monthly",
      value: "monthly",
    },
    {
      label: "Yearly",
      value: "yearly",
    },
  ];

  const unitsOfMeasurement = [
    {
      label: "Milliliters",
      value: "ml",
    },
    {
      label: "Liters",
      value: "l",
    },
    {
      label: "Grams",
      value: "g",
    },
    {
      label: "Kilograms",
      value: "kg",
    },
    {
      label: "Meters",
      value: "m",
    },
    {
      label: "Kilometers",
      value: "km",
    },
    {
      label: "Inches",
      value: "in",
    },
    {
      label: "Feet",
      value: "ft",
    },
    {
      label: "Miles",
      value: "mi",
    },
    {
      label: "Minutes",
      value: "min",
    },
    {
      label: "Hours",
      value: "h",
    },
    {
      label: "Days",
      value: "days",
    },
    {
      label: "Meals",
      value: "Meals",
    },
    {
      label: "Cups",
      value: "cups",
    },
  ];

  const validateHabit = () => {
    if (
      !habitName ||
      !habitTime ||
      !habitFrequency ||
      !habitUoM ||
      !habitQuantity
    ) {
      return false;
    }

    return true;
  };

  return (
    <SafeAreaView className="h-full bg-secondary">
      <View className="mx-2 border-2 border-primary bg-primary w-7 rounded-md">
        <AntDesign
          name="close"
          size={24}
          onPress={() => router.back()}
          color={"#EEE7D3"}
        />
      </View>
      <Center>
        <Flex direction="column" className="w-[80%]">
          <Box className="flex flex-row items-center justify-between">
            <Box className="h-12 w-12 bg-secondary rounded-md border-2 border-primary flex flex-row items-center justify-center">
              <Text className=" text-xl">{assignEmoji(habitName)}</Text>
            </Box>
            <TextInput
              mode="outlined"
              placeholder="What do you want to do?"
              className="w-[85%] h-12 text-lg"
              value={habitName}
              outlineStyle={{
                borderRadius: 6,
                borderColor: "#1C3F39",
                borderWidth: 2,
              }}
              style={{
                backgroundColor: "#EEE7D3",
                alignContent: "center",
                justifyContent: "center",
              }}
              onChangeText={(value) => setHabitName(value)}
            />
          </Box>
          <Box className=" flex flex-row items-center justify-between mt-6">
            <Box className="w-[45%] h-12">
              <TextInput
                className="h-12 text-lg"
                mode="outlined"
                placeholder="Quantity"
                inputMode="numeric"
                outlineStyle={{
                  borderRadius: 6,
                  borderColor: "#1C3F39",
                  borderWidth: 2,
                }}
                style={{ backgroundColor: "#EEE7D3" }}
                value={habitQuantity ? habitQuantity?.toString() : undefined}
                onChange={(e) => setHabitQuantity(Number(e.nativeEvent.text))}
              />
            </Box>

            <Box className="w-[45%] h-12">
              <Select
                height={"100%"}
                borderRadius={6}
                placeholder="Unit"
                placeholderTextColor={"#1C3F39"}
                outlineColor={"#1C3F39"}
                borderWidth={2}
                borderColor={"#1C3F39"}
                size={"xl"}
                selectedValue={habitUoM ? habitUoM : undefined}
                onValueChange={(value) => setHabitUoM(value)}
                dropdownIcon={
                  <AntDesign
                    name="down"
                    size={16}
                    style={{ paddingRight: 12 }}
                  />
                }
              >
                {unitsOfMeasurement.map((item, index) => {
                  return (
                    <Select.Item
                      key={index}
                      label={item.label}
                      value={item.value}
                    />
                  );
                })}
              </Select>
            </Box>
          </Box>

          <Box className=" flex flex-row items-center justify-between mt-6">
            <Box className="w-[45%] h-12">
              <Select
                height={"100%"}
                borderRadius={6}
                placeholder="Select frequency"
                placeholderTextColor={"#1C3F39"}
                outlineColor={"#1C3F39"}
                borderWidth={2}
                borderColor={"#1C3F39"}
                size={"xl"}
                selectedValue={habitFrequency}
                onValueChange={(value) => setHabitFrequency(value)}
                dropdownIcon={
                  <AntDesign
                    name="down"
                    size={16}
                    style={{ paddingRight: 12 }}
                  />
                }
              >
                {items.map((item, index) => {
                  return (
                    <Select.Item
                      key={index}
                      label={item.label}
                      value={item.value}
                    />
                  );
                })}
              </Select>
            </Box>

            <Box className="w-[45%] h-12">
              <TouchableOpacity
                onPress={() => setTimePickerVisible(true)}
                className="h-12 border-primary border-2 flex flex-row items-center justify-center rounded-md"
              >
                <Text className="text-center text-lg">
                  {habitTime
                    ? new Date(habitTime).toLocaleTimeString("en", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Select time"}
                </Text>
              </TouchableOpacity>
            </Box>
            {timePickerVisible && (
              <DateTimePicker
                mode="time"
                onChange={(_, date) => {
                  setTimePickerVisible(false);
                  setHabitTime(date ? date.toISOString().slice(0, 16) : null);
                }}
                value={habitTime ? new Date(habitTime) : new Date()}
              ></DateTimePicker>
            )}
          </Box>

          <Button
            marginTop={10}
            height={12}
            backgroundColor={"#1C3F39"}
            color={"#EEE7D3"}
            borderRadius={6}
            isDisabled={!validateHabit()}
            onPress={() => handleUpdateHabit()}
            isLoading={isLoading}
          >
            Update Habit
          </Button>
        </Flex>
      </Center>
    </SafeAreaView>
  );
};

export default EditHabitDetails;
