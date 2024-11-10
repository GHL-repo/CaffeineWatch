import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, Image, Pressable, ScrollView } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Link } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addHours, format } from 'date-fns';
import CustomButton from '@/components/CustomButton';
import CaffeineChart from '@/components/CaffeineChart';
import CafModal from "@/components/CafModal"
import user from "../assets/icons/user.png";
import coffee from "../assets/icons/coffee-shop.png";
import data from "../src/data";



export default function Index() {  

  const [cafTypes, setCafTypes] = useState(data.caffeineTypes); // Library of drink types with caffeine content (mg per drink)
  const [cafLog, setCafLog] = useState([]); // Log of caffeine intake entries
  const [cafTimeline, setCafTimeline] = useState([]); // Log of hourly caffeine levels throughout the day 
  const [mgCount, setMgCount] = useState(0); // Current caffeine level (mg)
  const [sleepTime, setSleepTime] = useState("22:30"); // Time when caffeine level falls below threshold

  const threshold = 100; 
  const timeZone = 1; // UTC+1

  // Modal management
  const [isCafModalVisible, setIsCafModalVisible] = useState(false);
  const [selectedCaf, setSelectedCaf] = useState(null);

  const openCafModal = (caffeineType) => {
    setSelectedCaf(caffeineType);
    setIsCafModalVisible(true);
  };

  const closeCafModal = () => {
    setIsCafModalVisible(false);
    setSelectedCaf(null);
  };

  const confirmCaffeine = () => {
    if (selectedCaf) {
      const { name, mgPerCup } = selectedCaf;
      setMgCount((prevMgCount) => prevMgCount + mgPerCup);
      storeMgData(mgCount + mgPerCup);
      handleAddCafLog(name, mgPerCup);
    }
    closeCafModal();
  };
  

  //test functions
  const resetMgCount = () => {setMgCount(0); storeMgData(0); resetLog();}
  const resetLog = async () => {
    const newCafLog = [];
    try {
      setCafLog(newCafLog);
    } catch (err) {
      alert(err);
    }    
    generateTimeline();
  };


  //Generate & populate timeline
  const generateTimeline = async () => {
    const range = 24;
    const offSet = 10;
    const currentDate = new Date(new Date().setHours(new Date().getHours() + timeZone)); // UTC+1
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
    for (let i = 0; i < cafLog.length; i++) {
      console.log(`cl${i}, At: ${cafLog[i].timeStamp}, mg: ${cafLog[i].amountOfMg} `);
    } 

    let prevAmount = 0;
    let decay = 0;
    
    for (let i = 0; i < timeline.length; i++) {
      
      // Check if there's a matching entry in cafLog for the current timeline hourStamp
      for (let j = 0; j < cafLog.length; j++) {      
        if (timeline[i].hourStamp === cafLog[j].timeStamp.slice(0, 13)) {
          timeline[i].amount += cafLog[j].amountOfMg;              
        }
      }      
      // Calculate decay based on the previous amount in the timeline
      if (i !== 0) {
        prevAmount = timeline[i - 1].amount;
        decay = prevAmount * Math.pow(0.5, 1 / 5);
      } 
      timeline[i].amount += decay;
    }

    console.log("=timeline=================================")
    for (let i = 0; i < timeline.length; i++) {
      console.log(`tl${i}, At: ${timeline[i].hourStamp}, mg: ${timeline[i].amount}`);
    } 
    console.log("==========================================")
    console.log("                                          ")

    setCafTimeline(timeline);
  };


  const handleAddCafLog = (name, amount) => {
    const date = new Date(new Date().setHours(new Date().getHours() + timeZone)).toISOString(); 
    const newCafEntry = { timeStamp: date, nameOfDrink: name, amountOfMg: amount };
    const newCafLog = [...cafLog, newCafEntry];
    setCafLog(newCafLog);
  };


  const calculateSleepTime = async () => {
    let foundTime = "";
    for (let i = cafTimeline.length-1; i >= 0; i--) {
      if (cafTimeline[i].amount <= threshold) {
        foundTime = cafTimeline[i].timeStamp;    
        if (i === 0) {
          foundTime = new Date(new Date().setHours(new Date().getHours() + timeZone)).toISOString();
        }    
      } else {
        break;
      }
    } 
    if (!foundTime) {
      setSleepTime("more than 12 hours");
    } else {
      setSleepTime(format(addHours(new Date(foundTime), -1), 'HH:mm'));
    }
  };

  // AsyncStore functions
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
    generateTimeline();    
  }, [cafLog]);

  useEffect(() => {
    calculateSleepTime();
  }, [cafTimeline]);

  useFocusEffect(
    useCallback(() => {
      getCaffeineTypes();
      getMgData();
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
      <Text className="font-pregular">Optimal sleep after: {sleepTime}</Text>
      
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
                handlePress={() => openCafModal({ name: caffeineType.name, mgPerCup: caffeineType.mgPerCup })}
                containerStyles="h-20 p-2 w-20 mt-5"
              />
            )
          })
        }

        <CafModal 
          isVisible={isCafModalVisible} 
          onClose={closeCafModal} 
          onConfirm={confirmCaffeine}
        >
          {selectedCaf && (
            <View>
              <Text className="text-lg font-semibold mb-3"> {selectedCaf.name} </Text>
              <Text className="text-lg font-semibold mb-3"> ({selectedCaf.mgPerCup} mg of caffeine) </Text>
            </View>
          )}
        </CafModal>
        
        <CustomButton
          title="Reset mg"
          handlePress={resetMgCount}
          containerStyles="bg-blue-400 h-20 p-2 w-20 mt-5"
        />


      </View>  
    </View>
    </ScrollView>
  );
}



