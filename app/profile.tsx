import React, {useEffect, useState, useCallback} from 'react';
import { Text, View, Button } from "react-native";


export default function Profile() { 
  const [isCafModalVisible, setIsCafModalVisible] = useState(false);

  const openCafModal = () => setIsCafModalVisible(true);
  const closeCafModal = () => setIsCafModalVisible(false);


  return (
    <View className="flex-1 items-start justify-start bg-white p-10">
      <Text className="font-pblack">About</Text>      
      <Text>This is a profile</Text>


    </View>
  );
}




