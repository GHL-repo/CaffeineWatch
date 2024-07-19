import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Text, View, Image } from "react-native";
import { Link } from "expo-router";
import CustomButton from '@/components/CustomButton';
import user from "../assets/icons/user.png";
import coffee from "../assets/icons/coffee-shop.png";
import graph from "../assets/images/graph.png";


export default function Index() {  
  const [mgCount, setMgCount] = useState(0);
  const resetMgCount = () => setMgCount(0);

  return (    
    <View className="flex justify-start min-h-full bg-white p-10">
      <StatusBar style="auto" />      
      
      <View className="flex flex-row justify-between h-14 bg-red-50">
        <Link className="bg-blue-400" href="/drinks">
          <Image 
            source={user}
            className="w-[40px] h-[40px]"
            resizeMode="contain"
          />
        </Link>
        <Link className="bg-blue-400" href="/profile">
          <Image 
            source={coffee}
            className="w-[40px] h-[40px]"
            resizeMode="contain"
          />
        </Link>
      </View>
      

      <View className="flex justify-between flex-row">
        <Text className="font-pregular">Current caffeine amount: </Text>
        <Text className="font-pregular ml-12">{mgCount}mg</Text>       
      </View>
      <Text className="font-pregular">Avoid Caffeine after: 16:20</Text>
      
      <View className="w-full h-53 border border-gray-200 bg-black">
        <Image
          source={graph}
          className="w-full h-52"
          resizeMode="shrink"
        />  
      </View>      
      


      <View className="flex flex-wrap flex-row justify-between">
        <CustomButton 
          title="Filter Coffee"
          handlePress={onPress = () => setMgCount(prevMgCount => prevMgCount + 95)}
          containerStyles="h-20 p-2 w-20 mt-5"
        />

        <CustomButton 
          title="Espresso"
          handlePress={onPress = () => setMgCount(prevMgCount => prevMgCount + 27)}
          containerStyles="h-20 p-2 w-20 mt-5"
        />  

        <CustomButton 
          title="Cappuccino"
          handlePress={onPress = () => setMgCount(prevMgCount => prevMgCount + 27)}
          containerStyles="h-20 p-2 w-20 mt-5"
        />  

        <CustomButton 
          title="Instant Coffee"
          handlePress={onPress = () => setMgCount(prevMgCount => prevMgCount + 82)}
          containerStyles="h-20 p-2 w-20 mt-5"
        />  

        <CustomButton 
          title="Decaf"
          handlePress={onPress = () => setMgCount(prevMgCount => prevMgCount + 15)}
          containerStyles="h-20 p-2 w-20 mt-5"
        />

        <CustomButton
        title="Reset"
        handlePress={resetMgCount}
        containerStyles="bg-blue-400 h-20 p-2 w-20 mt-5"
        /> 
        </View>

        
        

    </View>
  );
}



