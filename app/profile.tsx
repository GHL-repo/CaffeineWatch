import React, {useEffect, useState, useCallback} from 'react';
import { Text, View, Button } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {

  return (
    <View className="flex-1 items-start justify-start bg-white p-10">
      <Text className="font-pblack">About</Text>      
      <Text>This is a profile</Text>

    </View>
  );
}




