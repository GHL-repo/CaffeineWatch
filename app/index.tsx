import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Text, View } from "react-native";
import { Link } from "expo-router";
import CustomButton from '@/components/CustomButton';



export default function Index() {  
  const mgFilter = 95;
  const mgEspresso = 27;
  const mgCappuccino = 27;
  const mgInstant = 82;


  const [mgCount, setMgCount] = useState(0);
  const resetMgCount = () => setMgCount(0);


  return (
    
    <View className="flex-1 items-start justify-start bg-white p-10">
      
      <Text className="font-pblack">Index</Text>
      <StatusBar style="auto" />
      <Link className="font-pbold" href="/drinks">Go to my drinks</Link>
      <Link className="font-pbold" href="/profile">Go to profile</Link>
      <Text className="font-pregular">Current caffeine amount: {mgCount}mg</Text>
      <Text className="font-pregular">Avoid Caffeine after: 16:20</Text>

      <CustomButton 
        title="Filter Coffee"
        handlePress={onPress = () => setMgCount(prevMgCount => prevMgCount + 95)}
        containerStyles="w-full mt-3"
      />

      <CustomButton 
        title="Espresso"
        handlePress={onPress = () => setMgCount(prevMgCount => prevMgCount + 27)}
        containerStyles="w-full mt-3"
      />  

      <CustomButton 
        title="Cappuccino"
        handlePress={onPress = () => setMgCount(prevMgCount => prevMgCount + 27)}
        containerStyles="w-full mt-3"
      />  

      <CustomButton 
        title="Instant Coffee"
        handlePress={onPress = () => setMgCount(prevMgCount => prevMgCount + 82)}
        containerStyles="w-full mt-3"
      />  
    
      <CustomButton
      title="Reset"
      handlePress={resetMgCount}
      containerStyles="bg-blue-400 w-2/5 mt-3"
      /> 

    </View>
  );
}



