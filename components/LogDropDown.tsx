import React, { useState, useCallback } from "react";
import { View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import data from "../src/data";
import { useDrinkStore } from "@/store/store";

const LogDropDown = () => {
  const [value, setValue] = useState(null);
  const [cafTypes, setCafTypes] = useState(data.caffeineTypes);
  const setSelectedDrink = useDrinkStore((state) => state.setSelectedDrink);

  const getCaffeineTypes = async () => {
    try {
      let cafTypesStorage = await AsyncStorage.getItem("@cafTypesStorage");
      if (cafTypesStorage !== null) {
        setCafTypes(JSON.parse(cafTypesStorage));
      }
    } catch (err) {
      alert(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getCaffeineTypes();
    }, []),
  );

  const renderItem = (item) => {
    return (
      <View className="p-[17px] flex-row justify-between items-center">
        <Text className="flex-1 text-base">{item.name}</Text>
      </View>
    );
  };

  return (
    <Dropdown
      className="m-0 h-[50px] bg-gray-50 border border-gray-300 rounded-lg p-5"
      placeholderStyle={{ fontSize: 16 }}
      selectedTextStyle={{ fontSize: 16 }}
      data={cafTypes}
      maxHeight={300}
      labelField="name"
      valueField="id"
      placeholder="Select drink"
      value={value}
      onChange={(item) => {
        setValue(item.id);
        setSelectedDrink(item);
        console.log(item);
      }}
      renderItem={renderItem}
    />
  );
};

export default LogDropDown;
