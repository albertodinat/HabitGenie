import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, Input, Modal } from "native-base";
import { Habit } from "../interfaces/habits";
import _ from "lodash";
import { auth, db } from "../../firebase.config";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { router } from "expo-router";
import dayjs from "dayjs";

interface CustomModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedHabit: Habit;
  selectedDate?: string;
  setSelectedHabit: React.Dispatch<React.SetStateAction<Habit | null>>;
  // setSelectedDate: React.Dispatch<React.SetStateAction<String | null>>;
  getListData: (selectedDate?: string) => Promise<void>
}

const CustomModal = ({
  showModal,
  setShowModal,
  selectedHabit,
  selectedDate,
  setSelectedHabit,
  // setSelectedDate,
  getListData
}: CustomModalProps) => {
  const [localHabit, setLocalHabit] = React.useState<Habit>(selectedHabit);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const collectionRef = collection(db, "habit-logs");
    const q = query(
      collectionRef,
      where("habit_id", "==", doc(db, "Habits", selectedHabit.id)),
      where("log_date", "==", new Date().toDateString())
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length === 0) {
      const payload = {
        habit_id: doc(db, "Habits", selectedHabit.id),
        log_date: new Date(dayjs(selectedDate).toDate()).toDateString(),
        completed_units: localHabit?.completed_units,
        created_at: Timestamp.now(),
      };
      await addDoc(collection(db, "habit-logs"), payload).catch((err) =>
        console.log(err)
      );
    } else {
      const payload = {
        habit_id: doc(db, "Habits", selectedHabit.id),
        log_date: new Date(dayjs(selectedDate).toDate()).toDateString(),
        completed_units: localHabit?.completed_units,
      };
      await updateDoc(querySnapshot.docs[0].ref, payload).catch((err) => {
        console.log(err);
      });
    }
    setLoading(false);

    // setHabits(habitData);
  };

  useEffect(() => {
    setLocalHabit(selectedHabit);
  }, [selectedHabit]);

  const handleHabitLog = async () => {
    await getData();
    setShowModal(false);
    getListData();
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
        setSelectedHabit(null);
        getListData();
      }}
      _backdrop={{
        _dark: { bg: "coolGray.800" },
        bg: "coolGray.900",
      }}
    >
      {localHabit ? (
        <Modal.Content
          maxWidth="400px"
          borderWidth={3}
          borderColor={"#1c3f39"}
          backgroundColor={"#EEE7D3"}
          shadow={4}
        >
          <Modal.Header backgroundColor={"#EEE7D3"}>
            <Text className="text-primary text-xl">{localHabit.name}</Text>
          </Modal.Header>
          <Modal.Body>
            <Box className="flex flex-row items-center justify-center">
              <Box className="flex flex-row items-center justify-center">
                <Button
                  className="h-12 w-12 rounded-md bg-primary"
                  onPress={() => {
                    setLocalHabit((prev) => ({
                      ...prev,
                      completed_units: localHabit.completed_units - 1,
                    }));
                  }}
                >
                  -
                </Button>
                <Box className="w-1/3 ml-3 h-12">
                  <Input
                    inputMode="numeric"
                    value={
                      _.isNumber(localHabit.completed_units)
                        ? localHabit.completed_units.toString()
                        : ""
                    }
                    onChange={(e) => {
                      // TODO: need to fix this handling
                      console.log("first", e.nativeEvent.text);
                      setLocalHabit((prev) => ({
                        ...prev,
                        completed_units: !e.nativeEvent?.text
                          ? 0
                          : parseInt(e.nativeEvent.text),
                      }));
                    }}
                    height={"100%"}
                    fontSize={20}
                    textAlign={"center"}
                    isInvalid={
                      localHabit.completed_units > localHabit.total_units
                    }
                  />
                </Box>
                <Button
                  className="ml-3 w-12 h-12 rounded-md bg-primary"
                  onPress={() => {
                    setLocalHabit((prev) => ({
                      ...prev,
                      completed_units: localHabit.completed_units + 1,
                    }));
                  }}
                >
                  +
                </Button>
              </Box>
              <Text className="text-xl">
                {" "}
                / {localHabit.total_units} {localHabit.uom}
              </Text>
            </Box>
          </Modal.Body>
          <Modal.Footer backgroundColor={"#EEE7D3"}>
            <Box className="flex flex-row items-center justify-evenly w-full">
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                }}
                color={"#1C3F39"}
                width={"25%"}
              >
                Cancel
              </Button>
              <Button
                onPress={handleHabitLog}
                isLoading={loading}
                isDisabled={localHabit.completed_units > localHabit.total_units}
                backgroundColor={"#1C3F39"}
                width={"70%"}
                marginLeft={4}
              >
                Save
              </Button>
            </Box>
          </Modal.Footer>
        </Modal.Content>
      ) : (
        <></>
      )}
    </Modal>
  );
};

export default CustomModal;
