import React, { useCallback, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { TrashIcon } from "react-native-heroicons/outline";
import { useCaffeineStore } from "@/store/store";

export default function Profile() {
  const [cafLog, setCafLog] = useState([]);
  const { cafTypes, setCafTypes } = useCaffeineStore();

  // AsyncStore functions
  const getCafLog = async () => {
    try {
      let cafLogStorage = await AsyncStorage.getItem("@cafLogStorage");
      if (cafLogStorage !== null) {
        setCafLog(JSON.parse(cafLogStorage));
      }
    } catch (err) {
      alert(err);
    }
  };

  const storeCafLog = async (cafLog) => {
    try {
      const cafLogStorage = JSON.stringify(cafLog);
      await AsyncStorage.setItem("@cafLogStorage", cafLogStorage);
    } catch (err) {
      alert(err);
    }
  };

  const deleteCafLogEntry = (id) => {
    setCafLog((prevCafLog) => {
      const newCafLog = prevCafLog.filter((item) => item.timeStamp !== id);
      storeCafLog(newCafLog);
      return newCafLog;
    });
  };

  useFocusEffect(
    useCallback(() => {
      getCafLog();
    }, []),
  );

  const groupByDate = (data) => {
    return data.reduce((acc, item) => {
      const date = item.timeStamp.slice(5, 10); // MM-DD
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});
  };

  // Group the data by date
  const groupedData = groupByDate([...cafLog].reverse());

  // Flatten grouped data into an array suitable for FlatList
  const flatListData = Object.entries(groupedData).map(([date, drinks]) => ({
    date,
    drinks: [...drinks].reverse(),
  }));

  return (
    <View className="flex-1 items-start justify-start bg-white p-10">
      <View className="mt-5">
        <Text className="mb-3 font-bold text-lg">Recent drinks</Text>

        <FlatList
          data={flatListData}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <View className="mb-4 w-full">
              {/* Display date */}
              <Text className="text-lg font-psemibold">{item.date}</Text>
              {/* Render drinks under the date */}
              {item.drinks.map((drink, index) => (
                <View
                  key={index}
                  className="flex-row pl-3 mb-2 justify-between w-full"
                >
                  <Text className="text-base pr-3">
                    {drink.timeStamp.slice(11, 16)} {drink.nameOfDrink}
                  </Text>
                  <TouchableOpacity
                    onPress={() => deleteCafLogEntry(drink.timeStamp)}
                  >
                    <TrashIcon color="black" fill="white" size={22} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        />
      </View>
    </View>
  );
}
