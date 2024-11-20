import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  ViewToken,
} from "react-native";
import moment from "moment";
import styles from "./HorizontalDatePickerStyle";
import dayjs from "dayjs";
import { Box } from "native-base";

type Props = {
  pickerType: "date" | "time" | "datetime";
  returnDateFormat?: string;
  returnTimeFormat?: string;
  returnDateTimeFormat?: string;
  minDate?: string;
  maxDate?: string;
  defaultSelected?: string;
  dayFormat?: string;
  monthFormat?: string;
  yearFormat?: string;
  timeFormat?: string;
  timeStep?: number;
  onDateSelected?: (date: string) => void;
  onTimeSelected?: (time: string) => void;
  onDateTimeSelected?: (dateTime: {
    date: string;
    time: string;
    datetime: string;
  }) => void;
  selectedTextStyle?: object;
  unSelectedTextStyle?: object;
  isShowYear?: boolean;
  yearContainerStyle?: object;
  yearTextStyle?: object;
  datePickerContainerStyle?: object;
  timePickerContainerStyle?: object;
  datePickerBG?: string | undefined;
};

type DateItem = {
  date: string;
  day: string;
  month: string;
  year: string;
  isSelected: boolean;
};

type TimeItem = {
  time: string;
  timeDisplay: string;
  isSelected: boolean;
};

const defaultFormatDate = "DD-MM-YYYY";
const defaultFormatTime = "HH:mm:ss";

const HorizontalDatePicker: React.FC<Props> = ({
  pickerType,
  returnDateFormat,
  returnTimeFormat,
  returnDateTimeFormat,
  minDate,
  maxDate,
  defaultSelected,
  dayFormat,
  monthFormat,
  yearFormat,
  timeFormat,
  timeStep,
  onDateSelected,
  onTimeSelected,
  onDateTimeSelected,
  selectedTextStyle,
  unSelectedTextStyle,
  isShowYear,
  yearContainerStyle,
  yearTextStyle,
  datePickerContainerStyle,
  timePickerContainerStyle,
}) => {
  const [yearSelected, setYearSelected] = useState<string>("");
  const [arrayDates, setArrayDates] = useState<DateItem[]>([]);
  const [arrayTimes, setArrayTimes] = useState<TimeItem[]>([]);
  const timeFlatListRef = useRef<FlatList>(null);

  const viewabilityConfig = {
    waitForInteraction: true,
    itemVisiblePercentThreshold: 50,
  };

  useEffect(() => {
    const dateArray: string[] = [];
    const timeArray: string[] = [];

    // Logic to populate dateArray and timeArray (similar to class-based version)
    if (minDate && maxDate) {
      if (pickerType === "date" || pickerType === "datetime")
        dateArray.push(...getDateList(minDate, maxDate));
      if (pickerType === "time" || pickerType === "datetime") {
        const sameDay =
          moment(minDate).format(defaultFormatDate) ===
          moment(maxDate).format(defaultFormatDate);
        timeArray.push(
          ...getTimeList(
            minDate,
            sameDay
              ? maxDate
              : moment(minDate).set({ hours: 24, minutes: 0 }).toISOString()
          )
        );
      }
    } else if (minDate) {
      // Additional conditions to populate dateArray and timeArray
    } else if (maxDate) {
      // Additional conditions to populate dateArray and timeArray
    }

    const newDateArray = dateArray.map((item) => ({
      date: item,
      day: moment(item, defaultFormatDate).format(dayFormat),
      month: moment(item, defaultFormatDate).format(monthFormat),
      year: moment(item, defaultFormatDate).format(yearFormat),
      isSelected: false,
    }));

    let isCurrentFoundDate = false;
    if (defaultSelected) {
      const selectedDate = moment(defaultSelected).format(defaultFormatDate);
      newDateArray.forEach((item) => {
        if (item.date === selectedDate) {
          item.isSelected = true;
          isCurrentFoundDate = true;
        }
      });
    }
    setArrayDates(newDateArray);
    setYearSelected(newDateArray.length > 0 ? newDateArray[0].year : "");

    const newTimeArray = timeArray.map((item) => ({
      time: item,
      timeDisplay: moment(item, defaultFormatTime).format(timeFormat),
      isSelected: false,
    }));
    setArrayTimes(newTimeArray);

    if (onDateSelected) {
      if (defaultSelected && isCurrentFoundDate) {
        onDateSelected(moment(defaultSelected).format(returnDateFormat));
      } else {
        onDateSelected(
          moment(newDateArray[0].date, defaultFormatDate).format(
            returnDateFormat
          )
        );
      }
    }
    if (onTimeSelected && newTimeArray.length > 0) {
      onTimeSelected(
        moment(newTimeArray[0].time, defaultFormatTime).format(returnTimeFormat)
      );
    }
  }, [
    pickerType,
    minDate,
    maxDate,
    defaultSelected,
    dayFormat,
    monthFormat,
    yearFormat,
    timeFormat,
  ]);

  const getDateList = (minDate: string, maxDate: string): string[] => {
    const dateArray: string[] = [];
    let currentDate = moment(minDate);
    const stopDate = moment(maxDate);
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format(defaultFormatDate));
      currentDate = moment(currentDate).add(1, "days");
    }
    return dateArray;
  };

  const getTimeList = (minDate: string, maxDate: string): string[] => {
    const timeArray: string[] = [];
    let currentDate = moment(minDate).add(1, "hour").startOf("hour");
    const stopDate = moment(maxDate);
    while (currentDate <= stopDate) {
      timeArray.push(moment(currentDate).format(defaultFormatTime));
      currentDate = moment(currentDate).add(timeStep, "minutes");
    }
    return timeArray;
  };

  const onVisibleItemChange = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const firstItem = viewableItems[0]?.item as DateItem;
      if (firstItem && yearSelected !== firstItem.year) {
        setYearSelected(firstItem.year);
      }
    },
    [yearSelected]
  );

  const onPressDate = (item: DateItem) => () => {
    const newArrayDates = arrayDates.map((element) => ({
      ...element,
      isSelected: element.date === item.date,
    }));
    setArrayDates(newArrayDates);
    onDateSelected?.(
      moment(item.date, defaultFormatDate).format(returnDateFormat)
    );
  };

  const onPressTime = (item: TimeItem) => () => {
    const newArrayTimes = arrayTimes.map((element) => ({
      ...element,
      isSelected: element.time === item.time,
    }));
    setArrayTimes(newArrayTimes);
    onTimeSelected?.(
      moment(item.time, defaultFormatTime).format(returnTimeFormat)
    );
  };

  const renderDateItem = ({ item }: { item: DateItem }) => (
    <TouchableOpacity
      style={
        item.isSelected
          ? [styles.textSelected, selectedTextStyle, styles.itemViewStyle]
          : [styles.textUnSelected, unSelectedTextStyle, styles.itemViewStyle]
      }
      onPress={onPressDate(item)}
    >
      <Text
        className={`${item.isSelected ? "text-[#EEE7D3]" : "text-[#1C3F39]"}`}
      >
        {new Date(item.day).getDate()}
      </Text>
      <Text
        className={`${item.isSelected ? "text-[#EEE7D3]" : "text-[#1C3F39]"}`}
      >
        {dayjs(item.month).format("MMM")}
      </Text>
    </TouchableOpacity>
  );

  const renderTimeItem = ({ item }: { item: TimeItem }) => (
    <TouchableOpacity style={styles.itemViewStyle} onPress={onPressTime(item)}>
      <Text
        style={
          item.isSelected
            ? [styles.textSelected, selectedTextStyle]
            : [styles.textUnSelected, unSelectedTextStyle]
        }
      >
        {item.timeDisplay}
      </Text>
    </TouchableOpacity>
  );

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to the end after the FlatList has been rendered
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [arrayDates, flatListRef]); // Make sure it runs when arrayDates changes

  return (
    <View>
      {(pickerType === "date" || pickerType === "datetime") && isShowYear && (
        <View style={[styles.yearTextContainer, yearContainerStyle]}>
          <Text style={[styles.yearTextStyle, yearTextStyle]}>
            {yearSelected}
          </Text>
        </View>
      )}
      {(pickerType === "date" || pickerType === "datetime") && (
        <Box style={[styles.datePickerContainer, datePickerContainerStyle]}>
          <FlatList
            ref={flatListRef}
            horizontal
            data={arrayDates}
            className="rounded-xl"
            renderItem={renderDateItem}
            keyExtractor={(item) => item.date.toString()}
            extraData={arrayDates}
            onViewableItemsChanged={onVisibleItemChange}
            viewabilityConfig={viewabilityConfig}
            showsHorizontalScrollIndicator={false}
          />
        </Box>
      )}
      {(pickerType === "time" || pickerType === "datetime") && (
        <ImageBackground
          style={[styles.timePickerContainer, timePickerContainerStyle]}
        >
          <FlatList
            horizontal
            snapToEnd
            data={arrayTimes}
            renderItem={renderTimeItem}
            keyExtractor={(item) => item.time.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </ImageBackground>
      )}
    </View>
  );
};

export default HorizontalDatePicker;
