import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, Image, Pressable, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Link } from "expo-router";
import { addHours, format } from 'date-fns';
import DrinkButton from '@/components/DrinkButton';
import CaffeineChart from '@/components/CaffeineChart';
import CafModal from "@/components/CafModal"
import TimeSlider from "@/components/TimeSlider"
import user from "../assets/icons/user.png";
import coffee from "../assets/icons/coffee-shop.png";
import bean from "../assets/icons/coffee-bean.png";
import { ArrowUturnLeftIcon } from "react-native-heroicons/outline";
import { useCaffeineStore, useTimelineStore, useSettingsStore, useTimeStore } from '@/store/store'; 
import { iconData } from "../constants/Icons"
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function Index() {  
  const { cafTypes, setCafTypes } = useCaffeineStore();
  const { cafLog, setCafLog } = useTimelineStore();
  const { cafTimeline, setCafTimeline } = useTimelineStore();  
  const { selectedTime } = useTimeStore();
  // Settings
  const { threshold } = useSettingsStore();
  const { timeZone } = useSettingsStore();
  const range = 24; 
  const offSet = range/2;
  // Calculated
  const [mgCount, setMgCount] = useState(0); 
  const [sleepTime, setSleepTime] = useState("22:30"); 
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
      handleAddCafLog(name, mgPerCup);
    };
    closeCafModal();
  };
  

  // Test functions
  // const resetMgCount = () => {setMgCount(0); storeMgData(0); resetLog();}
  const resetMgCount = () => {setMgCount(0); resetLog();}
  const resetLog = async () => {
    const newCafLog = [];
    try {
      setCafLog(newCafLog);
      storeCafLog(newCafLog);
    } catch (err) {
      alert(err);
    }; 
    updateTimeline();
  };


  // Timeline functions
  const generateTimeline = (range, offSet, timeZone, threshold) => {
    const currentDate = new Date(new Date().setHours(new Date().getHours() + timeZone));
    const startingDate = new Date(currentDate);
    startingDate.setHours(startingDate.getHours() - offSet);

    return Array.from({ length: range * 60 }, (_, t) => {
      const date = new Date(startingDate.getTime() + t * 60 * 1000);
      return {
        timeStamp: date.toISOString(),
        hourMinStamp: date.toISOString().slice(0, 16),
        amount: 0,
        threshold: threshold,
      };
    });
  };

  const populateTimeline = (timeline, cafLog) => {
    let prevAmount = 0;

    timeline.forEach((entry, i) => {
      cafLog.forEach(log => {
        if (entry.hourMinStamp === log.timeStamp.slice(0, 16)) {
          entry.amount += log.amountOfMg;
        }
      });

      if (i !== 0) {
        prevAmount = timeline[i - 1].amount;
        const decayRatePerMinute = Math.pow(0.5, 1 / 300);
        entry.amount += prevAmount * decayRatePerMinute;
      };
    });

    return timeline;
  };

  const updateTimeline = async () => {
    const timeline = generateTimeline(range, offSet, timeZone, threshold);
    const populatedTimeline = populateTimeline(timeline, cafLog);
    
    setCafTimeline(populatedTimeline);
  };


  // Caflog functions
  const handleAddCafLog = (name, amount) => {
    const selectedTimeCopy = new Date(selectedTime); 
    selectedTimeCopy.setHours(selectedTimeCopy.getHours() + timeZone);
    const date = selectedTimeCopy.toISOString(); 

    const newCafEntry = { timeStamp: date, nameOfDrink: name, amountOfMg: amount };
    const newCafLog = [...cafLog, newCafEntry];

    setCafLog(newCafLog);
    storeCafLog(newCafLog);
  };

  const handleUndoCafLog = async () => {
    if (cafLog.length === 0) {
      console.error("cafLog is empty, no element to delete.");
      return;
    }

    const newCafLog = cafLog.slice(0, cafLog.length - 1);
    await storeCafLog(newCafLog);
    setCafLog(newCafLog);
  };
  

  // Sleeptime calculator
  const calculateSleepTime = async () => {
    let foundTime = "";
    let timeOfDay = "";
    let now = new Date(new Date().setHours(new Date().getHours() + timeZone)).toISOString();
    for (let i = cafTimeline.length-1; i >= 0; i--) {
      if (cafTimeline[i].amount <= threshold) {
        foundTime = cafTimeline[i].timeStamp;    
        if (i === 0) {
          foundTime = now;
        };
      } else {
        break;
      };
    };
    if (!foundTime) {
      setSleepTime(`more than ${range-offSet} hours`);
    } else {
      setSleepTime(format(addHours(new Date(foundTime), -1), 'HH:mm' + timeOfDay));
    };
  };

  const calculateCurrentMg = async () => {
    let foundMg = 0;
    const currentDate = new Date(new Date().setHours(new Date().getHours() + timeZone))
    const now = currentDate.toISOString().slice(0, 16)
    for (let i = cafTimeline.length-1; i >= 0; i--) {
      if (cafTimeline[i].hourMinStamp === now) {
        foundMg = cafTimeline[i].amount;
        break;
      };
    };
    const roundedMg = Math.round(foundMg * 10) / 10;
      setMgCount(roundedMg);
  };


  // AsyncStore functions
  const storeCafLog = async (cafLog) => {
    try {
      const cafLogStorage = JSON.stringify(cafLog);
      await AsyncStorage.setItem('@cafLogStorage', cafLogStorage);
    } catch (err) {
      alert(err);
    };
  };

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
  
  const getCaffeineTypes = async () => {
    try {
      let cafTypesStorage = await AsyncStorage.getItem("@cafTypesStorage");
      if (cafTypesStorage !== null) {
        setCafTypes(JSON.parse(cafTypesStorage));
      }
    } catch (err) {
      alert(err);
    };
  };


  // Effect hooks
  useEffect(() => {
    updateTimeline();   
  }, [cafLog]);

  useEffect(() => {
    const interval = setInterval(() => {      
      calculateCurrentMg();
      calculateSleepTime();
    }, 500);

    return () => clearInterval(interval);
  }, [confirmCaffeine]);

  useFocusEffect(
    useCallback(() => {
      getCaffeineTypes();
      getCafLog();
    }, [])
  );


  return (    
    <GestureHandlerRootView >
    {/* <ScrollView className="bg-white"> */}
    <View className="flex justify-start h-full p-10 bg-white">
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

      
      <View className="h-[200px]">
        <CaffeineChart 
          DATA={cafTimeline}
        />
      </View>

      <TimeSlider />

      
      <View className="flex flex-wrap flex-row justify-between mt-3">
      
        <ScrollView horizontal={true}>
        {
          cafTypes.map((caffeineType) => {
            const matchingIcon = iconData.find((icon) => icon.id === caffeineType.icon)?.icon;

            return (
              <View
                className="border h-[160px] w-[120px] p-2 mr-4 rounded-md flex items-center justify-center bg-secondary "
                key={caffeineType.id}
              >
                <TouchableOpacity
                  className="flex items-center justify-center"
                  onPress={() =>
                    openCafModal({
                      name: caffeineType.name,
                      mgPerCup: caffeineType.mgPerCup,
                    })
                  }
                >
                  {matchingIcon ? (
                    <View className="p-2 rounded-full bg-white">
                    <Image
                      source={matchingIcon}
                      className="h-10 w-10 flex mb-1"
                      style={{ tintColor: "black" }}
                      resizeMode="contain"
                    />
                    </View>
                  ) : (
                    <Text className="text-center">No Icon</Text>
                  )}

                  <Text className="text-center font-bold mb-2">{caffeineType.name}</Text>
                  {/* <Text className="text-center italic">250ml</Text> */}
                  <View className="flex-row items-center">
                    <Image
                        source={bean}
                        className="h-3 w-2 mr-1"
                        style={{ tintColor: "black" }}
                        resizeMode="contain"
                      />
                    <Text className="text-center text-sm italic">{caffeineType.mgPerCup}mg</Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        }
        </ScrollView>


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


      </View>  

      <View className="flex-row justify-end mt-5">
        <TouchableOpacity className="rounded-lg border p-[2px]" onPress={handleUndoCafLog}>
          <ArrowUturnLeftIcon color="black" size="20px"/>
        </ TouchableOpacity>
      </View>
      
    </View>
    {/* </ScrollView> */}
    </GestureHandlerRootView>
  );
};