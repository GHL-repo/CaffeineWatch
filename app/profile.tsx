import React, {useEffect, useState, useCallback} from 'react';
import { Text, View, Button } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  // TEST
  const [myColor, setMyColor] = useState("white");

  const storeColorData = async (col) => {
    setMyColor(col);
    try {
      await AsyncStorage.setItem("@color", JSON.stringify(col));
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

    ; //TEST
    // getCafData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getColorData();
    },[])
  );

  return (
    <View className="flex-1 items-start justify-start bg-white p-10">
      <Text className="font-pblack">About</Text>      
      <Text>This is a profile</Text>



      <Text>{myColor}</Text>
      <Button
        onPress={() => {          
          storeColorData("red");
        }}
        title="make red"
        color="red"
      />
      <Button
        onPress={() => {
          storeColorData("blue");
        }}
        title="make blue"
        color="blue"
      />









    </View>
  );
}




