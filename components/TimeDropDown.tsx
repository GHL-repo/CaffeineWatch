import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useTimeStore } from "@/store/store";

const TimeDropDown = () => {
  const { selectedTime, setSelectedTime } = useTimeStore();
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");

  const hourData = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    name: i.toString().padStart(2, "0"),
  }));

  const minuteData = Array.from({ length: 4 }, (_, i) => ({
    id: i * 15,
    name: (i * 15).toString().padStart(2, "0"),
  }));

  useEffect(() => {
    const now = new Date();
    const newTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      Number(hour),
      Number(minute),
    );
    setSelectedTime(newTime);
  }, [hour, minute]);

  const renderItem = (item: { id: number; name: string }) => {
    return (
      <View className="p-[17px] flex-row justify-between items-center">
        <Text className="flex-1 text-base">{item.name}</Text>
      </View>
    );
  };

  return (
    <View className="flex-row space-x-2">
      <Dropdown
        className="h-[50px] bg-gray-50 border border-gray-300 rounded-lg p-5 flex-1"
        placeholderStyle={{ fontSize: 16 }}
        selectedTextStyle={{ fontSize: 16 }}
        data={hourData}
        maxHeight={300}
        labelField="name"
        valueField="id"
        placeholder="HH"
        value={hour}
        onChange={(item) => {
          setHour(item.id);
        }}
        renderItem={renderItem}
      />
      <Dropdown
        className="h-[50px] bg-gray-50 border border-gray-300 rounded-lg p-5 flex-1"
        placeholderStyle={{ fontSize: 16 }}
        selectedTextStyle={{ fontSize: 16 }}
        data={minuteData}
        maxHeight={300}
        labelField="name"
        valueField="id"
        placeholder="MM"
        value={minute}
        onChange={(item) => {
          setMinute(item.id);
        }}
        renderItem={renderItem}
      />
    </View>
  );
};

export default TimeDropDown;
