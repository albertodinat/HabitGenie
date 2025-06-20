import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box, Button, Center, Flex, Select } from "native-base";
import { TextInput } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { assignEmoji, assignKeyword, frequencies, unitsOfMeasurements } from "../../utils/keywordToEmojiMap";
import { router } from "expo-router";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../../firebase.config";

const CreateHabit = () => {
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [habitName, setHabitName] = useState("");
  const [habitTime, setHabitTime] = useState<string | null>(null);
  const [habitFrequency, setHabitFrequency] = useState("daily");
  const [habitUoM, setHabitUoM] = useState<string | null>(null);
  const [habitQuantity, setHabitQuantity] = useState<number | null>(null);

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

  const handleCreateHabit = async () => {
    setIsLoading(true);
    await addDoc(collection(db, "Habits"), constructHabitPayload())
      .then((value) => {
        console.log("Document written with ID: ", value.id);
        router.back();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (assignKeyword(habitName)) {
      setHabitUoM(assignKeyword(habitName));
    }
  }, [habitName]);

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
    <SafeAreaView className="h-full bg-secondary py-5">
      <TouchableOpacity
        onPress={() => router.back()}      
        activeOpacity={0.7}
        >
        <View className="mx-5 mb-4 w-6 bg-primary rounded-md shadow-md shadow-black">
          <AntDesign
            name="close"
            size={24}
            // onPress={() => router.back()}
            color={"#EEE7D3"}
            className="rounded-md"
          />
        </View>
      </TouchableOpacity>
      <Center>
        <Flex direction="column" className="w-[90%] p-2 rounded-xl bg-primary shadow-md shadow-black">
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

            <Box className="w-[45%] h-12 bg-secondary rounded-md">
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
                {unitsOfMeasurements.map((item, index) => {
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
            <Box className="w-[45%] h-12 bg-secondary rounded-md">
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
                {frequencies.map((item, index) => {
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

            <Box className="w-[45%] h-12 bg-secondary rounded-md">
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
            backgroundColor={"#EEE7D3"}
            color={"#EEE7D3"}
            borderRadius={6}
            isDisabled={!validateHabit()}
            onPress={() => handleCreateHabit()}
            isLoading={isLoading}
          >
            <Text className="text-primary font-bold text-xl">
              Add Habit
            </Text>
          </Button>
        </Flex>
      </Center>
    </SafeAreaView>
  );
};

export default CreateHabit;
