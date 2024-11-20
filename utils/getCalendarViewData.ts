import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase.config";
import { Habit } from "../app/interfaces/habits";
import dayjs from "dayjs";

export const getData = async (
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setAveragePercentage: React.Dispatch<React.SetStateAction<number>>,
  setCompletedHabits: React.Dispatch<React.SetStateAction<number>>,
  selectedDate?: string
) => {
  setIsLoading(true);
  const collectionRef = collection(db, "Habits");
  const q = query(collectionRef, where("userId", "==", auth.currentUser?.uid));
  const querySnapshot = await getDocs(q);

  const habitData: Habit[] = [];
  let habitPercentage = 0;
  let totalCompletedHabits = 0;

  for (const item of querySnapshot.docs) {
    const collectionRef1 = collection(db, "habit-logs");
    const q1 = query(
      collectionRef1,
      where("habit_id", "==", doc(db, "Habits", item.id)),
      where(
        "log_date",
        "==",
        selectedDate
          ? new Date(dayjs(selectedDate).toDate()).toDateString()
          : new Date().toDateString()
      )
    );

    const querySnapshot1 = await getDocs(q1);
    const completedUnits =
      querySnapshot1.docs[0]?.data()?.["completed_units"] || 0;
    const totalUnits = item.data().total_units;

    habitData.push({
      ...item.data(),
      id: item.id,
      completed_units: completedUnits,
    } as Habit);

    if (completedUnits === totalUnits) {
      totalCompletedHabits++;
    }
    habitPercentage += (completedUnits / totalUnits) * 100;
  }

  setHabits(habitData);

  // Calculate the average percentage
  if (habitData.length) {
    const average = habitPercentage / habitData.length;
    setAveragePercentage(Math.floor(average)); // Rounding for cleaner display
    setCompletedHabits(totalCompletedHabits);
  }

  setIsLoading(false);
};
