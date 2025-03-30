import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import bean from "../assets/icons/coffee-bean.png";
import {
  useTimelineStore,
  useSettingsStore,
  useTimeStore,
} from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CafMenu = ({ cafTypes, iconData, useShowBackBtn }) => {
  const { cafLog, setCafLog } = useTimelineStore();
  const { selectedTime } = useTimeStore();
  const { timeZone } = useSettingsStore();

  const handleAddCafLog = (name, amount) => {
    const selectedTimeCopy = new Date(selectedTime);
    selectedTimeCopy.setHours(selectedTimeCopy.getHours() + timeZone);
    const date = selectedTimeCopy.toISOString();

    const newCafEntry = {
      timeStamp: date,
      nameOfDrink: name,
      amountOfMg: amount,
    };
    const newCafLog = [...cafLog, newCafEntry];

    setCafLog(newCafLog);
    storeCafLog(newCafLog);
    useShowBackBtn(true);
  };

  // AsyncStore functions
  const storeCafLog = async (cafLog) => {
    try {
      const cafLogStorage = JSON.stringify(cafLog);
      await AsyncStorage.setItem("@cafLogStorage", cafLogStorage);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <View className="mt-3 mb-[220px]">
      <View className="flex flex-row flex-wrap justify-between">
        {cafTypes.map((caffeineType, index) => {
          const matchingIcon = iconData.find(
            (icon) => icon.id === caffeineType.icon,
          )?.icon;

          return (
            <TouchableOpacity
              key={index}
              className="w-[88px] h-[120px] mb-[15px] rounded-lg bg-gray-50 items-center justify-center border border-gray-300"
              onPress={() =>
                handleAddCafLog(caffeineType.name, caffeineType.mgPerCup)
              }
            >
              {matchingIcon ? (
                <View className="p-1.5 rounded-full bg-white border-2">
                  <Image
                    source={matchingIcon}
                    className="h-8 w-8 flex mb-1"
                    style={{ tintColor: "black" }}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <Text className="text-center">No Icon</Text>
              )}
              <Text className="text-center font-bold mt-2" numberOfLines={1}>
                {caffeineType.name.length > 10
                  ? `${caffeineType.name.slice(0, 8)}...`
                  : caffeineType.name}
              </Text>
              <View className="flex-row items-center">
                <Image
                  source={bean}
                  className="h-3 w-2 mr-1"
                  style={{ tintColor: "black" }}
                  resizeMode="contain"
                />
                <Text className="text-center text-sm italic">
                  {caffeineType.mgPerCup}mg
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
        {/* Fixes justify-between issue with lists */}
        {cafTypes.length % 3 !== 0 && (
          <View className="w-[88px] h-[120px] mb-[15px] opacity-0" />
        )}
      </View>
    </View>
  );
};

export default CafMenu;
