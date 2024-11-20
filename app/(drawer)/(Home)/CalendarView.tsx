import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Center } from "native-base";
import { FAB } from "react-native-paper";
import { router } from "expo-router";
import HorizontalDatePicker from "../../../components/HorizontalDatePicker";
import DailyProgressComponent from "../../../components/DailyProgressComponent";
import HabitsList from "../../../components/HabitsList";
import CustomModal from "../../(Screens)/Modal";
import { getData } from "../../../utils/getCalendarViewData";
import { useDate } from "../../Contexts/GlobalDateContext"; // Import the global date context
import { Habit } from "../../interfaces/habits";

export default function TabTwoScreen() {
  const { selectedDate, setSelectedDate } = useDate(); // Use global state
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [averagePercentage, setAveragePercentage] = useState(0);
  const [completedHabits, setCompletedHabits] = useState(0);

  const fireGetData = async () => {
    await getData(setHabits, setIsLoading, setAveragePercentage, setCompletedHabits, selectedDate);
  };

  useEffect(() => {
    if (!showModal && selectedDate) {
      fireGetData();
    }
  }, [selectedDate, showModal]);

  return (
    <SafeAreaView className="h-full bg-secondary">
      <Center className="-mt-10 self-center px-2">
        <HorizontalDatePicker
          pickerType="date"
          onDateSelected={(d: string) => {
            setIsLoading(true);
            setSelectedDate(d); // Set the global selected date
          }}
          defaultSelected={selectedDate || new Date().toDateString()}
          unSelectedTextStyle={{ color: "#1C3F39" }}
          selectedTextStyle={{
            backgroundColor: "#1C3F39",
            color: "#EEE7D3",
            borderRadius: 14,
            padding: 3,
          }}
          maxDate={new Date().toISOString()}
          minDate={new Date(new Date().setDate(new Date().getDate() - 20)).toISOString()}
          isShowYear={false}
          datePickerBG={"#FF0000"}
          datePickerContainerStyle={{
            backgroundColor: "#a6a193",
            borderRadius: 17,
            borderBottomRadius: 20,
            paddingLeft: 8,
            paddingRight: 8,
          }}
        />
      </Center>
      
      <DailyProgressComponent
        averagePercentage={averagePercentage}
        completedHabits={completedHabits}
        habits={habits}
      />

      <HabitsList
        habits={habits}
        isLoading={isLoading}
        getData={fireGetData}
        setShowModal={setShowModal}
        setSelectedHabit={setSelectedHabit}
      />

      <FAB
        icon="plus"
        style={{
          position: "absolute",
          bottom: 15,
          right: 15,
          backgroundColor: "#88D498",
          borderRadius: 100,
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 1,
          shadowRadius: 5,
          shadowColor: "black",
        }}
        color="#1C3F39"
        onPress={() => router.push("/(Screens)/CreateHabit")}
      />

      {selectedHabit && (
        <CustomModal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedHabit={selectedHabit}
          selectedDate={selectedDate} // Pass the global selected date
          setSelectedHabit={setSelectedHabit}
          getListData={fireGetData}
        />
      )}
    </SafeAreaView>
  );
}