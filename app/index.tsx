import React, {useEffect, useState, useCallback} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, Pressable, ScrollView } from "react-native";
import { Link } from "expo-router";
import CustomButton from '@/components/CustomButton';
import CaffeineChart from '@/components/CaffeineChart';
import user from "../assets/icons/user.png";
import coffee from "../assets/icons/coffee-shop.png";
import data from "../src/data";
import cafLogTest from "../src/cafLogTest";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';



export default function Index() {  
  const [mgCount, setMgCount] = useState(0);
  const [cafTypes, setCafTypes] = useState(data.caffeineTypes);
  
  const [sleepTime, setSleepTime] = useState("100");
  const [cafLog, setCafLog] = useState(cafLogTest.drinksLog); // Logs all entries
  const [cafTimeline, setCafTimeline] = useState([]); // Logs mg each hour of a day

  const resetMgCount = () => {setMgCount(0); storeMgData(0); resetLog();}

  const threshold = 100;
  

  //test functions
  const resetLog = async () => {
    try {
      date = new Date();
      setCafLog (cafLogTest.drinksLog);
    } catch (err) {
      alert(err);
    }    
  };


  //Generate & populate timeline
  const generateTimeline = async () => {
    const range = 36;
    const offSet = range / 2;
    const currentDate = new Date(new Date().getTime() + 1 * 60 * 60 * 1000); // UTC+1
    const startingDate = new Date(currentDate);
    startingDate.setHours(startingDate.getHours() - offSet);
    
    let timeline = Array.from({ length: range }, (_, t) => {
      const date = new Date(startingDate.getTime() + t * 60 * 60 * 1000);
    
      return {
        timeStamp: date.toISOString(),
        hourStamp: date.toISOString().slice(0, 13),
        amount: 0,
        threshold: threshold
      };
    });
    

    console.log("=cafLog===================================")
    for (let i = 0; i < cafLogTest.drinksLog.length; i++) {
      console.log(`cl${i}, At: ${cafLogTest.drinksLog[i].timeStamp}, mg: ${cafLogTest.drinksLog[i].amountOfMg} `);
    } 

    const cafLogMap = new Map (cafLogTest.drinksLog.map(item => [item.timeStamp.slice(0, 13), item.amountOfMg]));
    let prevAmount = 0;
    let decay = 0;

    for (let i = 0; i < timeline.length; i++) {
      
      if (cafLogMap.has(timeline[i].hourStamp)) {
        timeline[i].amount = cafLogMap.get(timeline[i].hourStamp);              
      }       
      if (i !== 0) {
        prevAmount = timeline[i-1].amount;
        decay = prevAmount * Math.pow(0.5, 1 / 5);
      } 
      timeline[i].amount += decay;
    }

    console.log("=timeline=after===========================")
    for (let i = 0; i < timeline.length; i++) {
      console.log(`tl${i}, At: ${timeline[i].hourStamp}, mg: ${timeline[i].amount}`);
    } 
    console.log("==========================================")
    console.log("                                          ")
    console.log("                                          ")     

    setCafTimeline(timeline);

  };


  const handleAddCafLog = (name, amount) => {
    date = new Date();
    const newCafEntry = {timeStamp: date, name: name, amount: amount};
    const newCafLog = [...cafLog, newCafEntry];
    setCafLog(newCafLog);
    console.log(JSON.stringify(newCafLog, null, 2));
  }


  // const calculateSleepTime = async () => {
  //   for (let i = 0; i < cafLog.length; i++) {
  //     if (cafLog[i].amount < 100) {
  //       setSleepTime(cafLog[i].time);
  //     }
  //   }    
  // }


  const storeMgData = async (mgCount) => {
    setMgCount(mgCount)
    try {
      await AsyncStorage.setItem("@mgCount", JSON.stringify(mgCount));
    } catch (err) {
      alert(err);
    }
  };

  const getMgData = async () => {
    try {
      let mgCount = await AsyncStorage.getItem("@mgCount");
      if (mgCount !== null) {
        setMgCount(JSON.parse(mgCount));
      }
    } catch (err) {
      alert(err);
    }
  };

  // AsyncStore functions
  const storeCafLog = async (cafLog) => {
    try {
      const cafLogStorage = JSON.stringify(cafLog);
      await AsyncStorage.setItem('@cafLogStorage', cafLogStorage);
    } catch (err) {
      alert(err);
    }
  };

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


  const storeCaffeineTypes = async (cafTypes) => {
    try {
      const cafTypesStorage = JSON.stringify(cafTypes);
      await AsyncStorage.setItem('@cafTypesStorage', cafTypesStorage);
    } catch (err) {
      alert(err);
    }
  };  
  
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

  useEffect(() => {
    //useEffect
    generateTimeline();
    
  }, []);

  useFocusEffect(
    useCallback(() => {
      getCaffeineTypes();
      getMgData();
      generateTimeline();
    },[])
  );

  return (    
    <ScrollView className="bg-white">
    <View className="flex justify-start h-full p-10">
      <StatusBar style="auto"/>      
      
      <View className="flex flex-row justify-between h-[40px] mb-6">
        <Link className="" href="/profile" asChild>
          <Pressable>
            <Image 
              source={user}
              className="w-[40px] h-[40px]"
              resizeMode="contain"
            />
          </Pressable>
        </Link>
        <Link className="" href="/drinks" asChild>
          <Pressable>
            <Image 
              source={coffee}
              className="w-[40px] h-[40px]"
              resizeMode="contain"
            />
          </Pressable>
        </Link>
      </View>


      <View className="flex justify-between flex-row">        
        <Text className="font-pregular">Current caffeine amount: </Text>
        <Text className="font-pregular ml-12">{mgCount}mg</Text>       
      </View>
      <Text className="font-pregular">Avoid Caffeine after: {sleepTime}</Text>
      
      <View className="h-[200px] bg-white">
        <CaffeineChart 
          DATA={cafTimeline}
        />
      </View>

      <View className="flex flex-wrap flex-row justify-between">
        {
          cafTypes.map( caffeineType => {
            return (
              <CustomButton 
                key={caffeineType.id}
                title={caffeineType["name"]}
                handlePress={onPress = () => {
                  setMgCount(prevMgCount => prevMgCount + caffeineType["mgPerCup"]);
                  storeMgData(mgCount + caffeineType["mgPerCup"]);               
                  handleAddCafLog(caffeineType["name"],caffeineType["mgPerCup"]);
                }}
                containerStyles="h-20 p-2 w-20 mt-5"
              />
            )
          })
        }
        
        <CustomButton
          title="Reset mg"
          handlePress={resetMgCount}
          containerStyles="bg-blue-400 h-20 p-2 w-20 mt-5"
        />

        <CustomButton
          title="Time Line"
          handlePress={generateTimeline}
          containerStyles="bg-gray-400 h-20 p-2 w-20 mt-5"
        />




      </View>  
    </View>
    </ScrollView>
  );
}



