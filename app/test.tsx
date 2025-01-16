import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  TextInput,
  View,
  Image,
  FlatList,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import data from "../src/data";
import DrinksListEl from "@/components/DrinksListEl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { iconData } from "../constants/Icons";
import DraggableFlatList, {
  OpacityDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Profile() {
  const [cafTypes, setCafTypes] = useState(data.caffeineTypes);
  const [cafName, setCafName] = useState();
  const [cafMg, setCafMg] = useState();
  const [cafIcon, setCafIcon] = useState("coffeeDefault");
  const [curEditId, setCurEditId] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    // ...
  }, []);

  useFocusEffect(
    useCallback(() => {
      // ...
    }, []),
  );

  return (
    <View className="h-full bg-white p-8">
      <Text className="text-xl font-bold mb-3">Settings</Text>
      <Text className="text-sm font-normal mb-1">Timezone</Text>
      <Text className="text-sm font-normal mb-1">Bedtime</Text>
      <Text className="text-sm font-normal mb-1">Caffeine Tolerance</Text>
      <Text className="text-sm font-normal mb-1">Warning</Text>
      <Text className="text-sm font-normal mb-1">Day starts at</Text>
    </View>
  );
}
