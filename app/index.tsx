import React, {useEffect, useState, useCallback} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, Pressable, ScrollView } from "react-native";
import { Link } from "expo-router";
import CustomButton from '@/components/CustomButton';
import CaffeineChart from '@/components/CaffeineChart';
import user from "../assets/icons/user.png";
import coffee from "../assets/icons/coffee-shop.png";
import data from "../src/data";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';



export default function Index() {  
  const [mgCount, setMgCount] = useState(0);
  const [cafTypes, setCafTypes] = useState(data.caffeineTypes);
  const resetMgCount = () => {setMgCount(0); storeMgData(0);}


  const threshold = 100;
  const halfLife = 5;          
  const hours = 36;         

  let DATA = Array.from({ length: hours }, (_, t) => ({
      time: t,
      amount: mgCount * Math.pow(0.5, t / halfLife),
      threshold: threshold,
  }));

  const calculateAvoid = async (mgCount) => {
    mgCount * Math.pow(0.5, t / halfLife)
  }

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
  }, []);

  useFocusEffect(
    useCallback(() => {
      getCaffeineTypes();
      getMgData();
      // console.log(cafTypes)
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
      <Text className="font-pregular">Avoid Caffeine after: 16:20</Text>
      
      <View className="h-[200px] bg-white">
        <CaffeineChart 
          mgCount={mgCount}
          threshold={threshold}
          DATA={DATA}
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
                }}
                containerStyles="h-20 p-2 w-20 mt-5"
              />
            )
          })
        }
        
        <CustomButton
          title="Reset"
          handlePress={resetMgCount}
          containerStyles="bg-blue-400 h-20 p-2 w-20 mt-5"
        />
      </View>  
    </View>
    </ScrollView>
  );
}



