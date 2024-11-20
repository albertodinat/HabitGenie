// contexts/DateContext.tsx
import React, { createContext, useState, useContext } from "react";

interface DateContextProps {
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
}

const DateContext = createContext<DateContextProps | undefined>(undefined);

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toDateString());

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
};

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDate must be used within a DateProvider");
  }
  return context;
};