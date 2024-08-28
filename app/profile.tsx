import React, {useEffect, useState} from 'react';
import { Text, View, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  // TEST
  const [myColor, setMyColor] = useState("white");

  const storeColorData = async (myColor) => {
    try {
      await AsyncStorage.setItem("@color", JSON.stringify(myColor));
    } catch (err) {
      alert(err);
    }
  };

  const getColorData = async () => {
    try {
      let myColor = await AsyncStorage.getItem("@color");
      if (myColor !== null) {
        setMyColor(JSON.parse(myColor));
      }
    } catch (err) {
      alert(err);
    }
  };

  // TSET

  useEffect(() => {

    getColorData(); //TEST
    // getCafData();
  }, []);

  return (
    <View className="flex-1 items-start justify-start bg-white p-10">
      <Text className="font-pblack">About</Text>      
      <Text>This is a profile</Text>



      <Text>{myColor}</Text>
      <Button
        onPress={() => {
          setMyColor("red");
          storeColorData(myColor);
        }}
        title="make red"
        color="red"
      />
      <Button
        onPress={() => {
          setMyColor("blue");
          storeColorData(myColor);
        }}
        title="make blue"
        color="blue"
      />









    </View>
  );
}




