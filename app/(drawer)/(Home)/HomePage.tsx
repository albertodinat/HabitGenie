import { Animated, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../../../components/Themed";
import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase.config";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box, Center, Flex, Select } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { LiquidGauge } from "react-native-liquid-gauge";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { StatusBar } from "react-native";
import { useDate } from "../../Contexts/GlobalDateContext"; // Import the useDate hook

export default function TabOneScreen() {
  const [selected, setSelected] = useState("");
  const { selectedDate, setSelectedDate } = useDate(); // Use global context
  const [datePickerVisibility, setDateVisibility] = useState(false);
  const [rand, setRand] = useState(Math.floor(Math.random() * 100));

  const data = [
    { key: "1", label: "Mobiles", value: "Mobiles", disabled: true },
    { key: "2", label: "Today", value: "Today" },
    { key: "3", label: "Cameras", value: "Cameras" },
  ];
  const [user, setUser] = useState<any | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [auth]);

  const onAuthStateChanged = (user: any) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  return (
    <SafeAreaView className="h-full bg-secondary">
      {user && (
        <View className="flex flex-col items-center justify-center w-full h-full gap-y-6 bg-secondary">
          <View className="w-full px-4 flex flex-row items-start justify-center bg-transparent shadow-md shadow-black">
            <View className="rounded-2xl w-1/2 h-12 bg-primary mr-4 relative flex flex-row items-center justify-center">
              <TouchableOpacity
                className="flex items-center justify-center w-full relative"
                onPress={() => setDateVisibility(true)}
                activeOpacity={0.5}
              >
                <Text className="text-secondary text-lg">
                  {dayjs().isSame(dayjs(selectedDate), "day")
                    ? "Today"
                    : dayjs(selectedDate).format("DD MMM YYYY")}
                </Text>
              </TouchableOpacity>

              {datePickerVisibility && (
                <View className="flex bg-white rounded-xl absolute top-10 z-10 left-0 p-2 w-80 mt-4">
                  <DateTimePicker
                    mode="single"
                    date={dayjs(selectedDate).toDate()}
                    onChange={(params) => {
                      setSelectedDate(dayjs(params.date).toISOString());
                      setDateVisibility(false);
                    }}
                    selectedItemColor="#1C3F39"
                    selectedTextStyle={{ color: "#EEE7D3" }}
                    dayContainerStyle={{ backgroundColor: "#EEE7D3" }}
                  />
                  <View className="bg-primary items-center justify-center rounded-xl w-full h-10 mb-2">
                    <TouchableOpacity
                      onPress={() => {
                        setDateVisibility(false);
                      }}
                      className="w-full items-center justify-center"
                      activeOpacity={0.7}
                    >
                      <Text className="text-secondary font-semibold">
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            <View className="w-1/2 h-12  text-secondary rounded-2xl">
              <Select
                placeholder="Select Habit"
                selectedValue={selected}
                onValueChange={(value) => setSelected(value)}
                fontSize={18}
                style={{ height: "100%" }}
                background={"#1C3F39"}
                backgroundColor={"#1C3F39"}
                height={"full"}
                borderRadius={16}
                borderColor={"transparent"}
                paddingLeft={4}
                color={"#EEE7D3"}
                placeholderTextColor={"#EEE7D3"}
                dropdownIcon={
                  <AntDesign
                    name="down"
                    size={16}
                    color="#EEE7D3"
                    style={{ paddingRight: 16 }}
                  />
                }
              >
                {data.map((item) => {
                  return (
                    <Select.Item
                      key={item.key}
                      label={item.label}
                      value={item.value}
                      isDisabled={item?.disabled}
                    />
                  );
                })}
                <Select.Item label="Mobiles" value="Mobiles" />
                <Select.Item label="Today" value="Today" />
                <Select.Item label="Cameras" value="Cameras" />
              </Select>
            </View>
          </View>

          <Flex
            direction="column"
            alignItems="center"
            justifyContent="space-evenly"
            className="w-[95%] h-[85%] bg-primary rounded-3xl -z-20 shadow-md shadow-black"
          >
            <TouchableOpacity
              onPress={() => router.push("/(drawer)/(Home)/CalendarView")}
              className="w-full h-full flex flex-col items-center justify-between relative"
              activeOpacity={0.7}
            >
              <Center className="pb-6">
                <Text className="text-secondary text-base font-bold">
                  Congratulations on streak!
                </Text>
              </Center>

              <Box className="w-full flex items-center justify-center top-20 absolute">
                <LiquidGauge
                  config={{
                    circleColor: "#1C3F39",
                    textColor: "#132c27",
                    waveHeight: 0.1,
                    waveTextColor: "#132c27",
                    waveColor: "#132c27",
                    circleThickness: 0.2,
                    circleFillGap: 0.03,
                    textVertPosition: rand * 0.01,
                    waveAnimateTime: 1000,
                    textSize: 0,
                  }}
                  value={rand}
                  width={350}
                  height={350}
                />
              </Box>
              <Box className="w-full flex items-center justify-center top-20 absolute">
                <LiquidGauge
                  config={{
                    circleColor: "#1C3F39",
                    textColor: "#88D498",
                    waveTextColor: "#1C3F39",
                    textSize: 1.1,
                    waveColor: "#607874",
                    circleThickness: 0.2,
                    circleFillGap: 0.03,
                    textVertPosition: 0.2,
                    waveAnimateTime: 1500,
                    waveOffset: 0.3,
                  }}
                  value={rand}
                  width={350}
                  height={350}
                />
              </Box>
              <View className="bg-transparent absolute top-20">
                <AnimatedCircularProgress
                  size={350}
                  width={30}
                  fill={rand}
                  tintColor="#88D498"
                  backgroundColor="#607874"
                  rotation={0}
                />
              </View>
            </TouchableOpacity>
          </Flex>
        </View>
      )}
    </SafeAreaView>
  );
}