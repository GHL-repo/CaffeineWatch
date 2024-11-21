import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, FlatList } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCaffeineStore } from '@/store/store';




export default function Profile() {
  
  const [cafLog, setCafLog] = useState([]);
  const { cafTypes, setCafTypes } = useCaffeineStore();


  // AsyncStore functions
  const getCafLog = async () => {
    try {
      let cafLogStorage = await AsyncStorage.getItem("@cafLogStorage");
      if (cafLogStorage !== null) {
        setCafLog(JSON.parse(cafLogStorage));
      };
    } catch (err) {
      alert(err);
    };
  };



  useFocusEffect(
    useCallback(() => {
      getCafLog();
      console.log(cafTypes);
    },[])
  );

  const groupByDate = (data) => {
    return data.reduce((acc, item) => {
      const date = item.timeStamp.slice(5, 10); // Extract date in MM-DD format
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
  const flatListData = Object.entries(groupedData).map(([date, drinks]) => ({ date, drinks }));
  

  return (
    <View className="flex-1 items-start justify-start bg-white p-10">



      <Text className="mb-3 font-pblack">Recent drinks</Text>      

      <FlatList
        data={flatListData}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View className="mb-4">
            {/* Display date */}
            <Text className="text-lg font-psemibold">{item.date}</Text>
            {/* Render drinks under the date */}
            {item.drinks.map((drink, index) => (
              <Text key={index} className="pl-3">{drink.timeStamp.slice(11, 16)} {drink.nameOfDrink}</Text>
            ))}
          </View>
        )}
      />


    </View>
  );
}

