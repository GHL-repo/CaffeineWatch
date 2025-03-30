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
import Header from "@/components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { iconData } from "../constants/Icons";
import DraggableFlatList, {
  OpacityDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Pressable } from "react-native";
import { Link } from "expo-router";
import coffee from "../assets/icons/coffee-shop.png";
import { ChevronRightIcon } from "react-native-heroicons/outline";

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
    <View>
      <Header />

      <View className="h-full bg-white pt-2 pl-10 pr-10">
        <Text className="text-xl font-bold mb-5">Settings</Text>

        <View className="rounded-lg bg-gray-50 border border-gray-300 px-3 py-[19px] mb-2">
          <Link className="" href="/drinks" asChild>
            <Pressable className="flex-row justify-between items-center">
              <Text className="text-lg font-normal">Customize Drinks Menu</Text>
              <ChevronRightIcon color="black" fill="white" size={22} />
            </Pressable>
          </Link>
        </View>

        <View className="rounded-lg bg-gray-50 border border-gray-300 p-3 mb-2">
          <Link className="" href="/settings" asChild>
            <Pressable className="flex-row justify-between items-center">
              <View>
                <Text className="text-sm font-normal">Caffeine Tolerance</Text>
                <Text className="text-sm font-normal text-blue-400">100mg</Text>
              </View>
              <ChevronRightIcon color="black" fill="white" size={22} />
            </Pressable>
          </Link>
        </View>

        <View className="rounded-lg bg-gray-50 border border-gray-300 p-3 mb-2">
          <Link className="" href="/settings" asChild>
            <Pressable className="flex-row justify-between items-center">
              <View>
                <Text className="text-sm font-normal">Theme</Text>
                <Text className="text-sm font-normal text-blue-400">
                  Light (default)
                </Text>
              </View>
              <ChevronRightIcon color="black" fill="white" size={22} />
            </Pressable>
          </Link>
        </View>
        {/* <Text className="text-sm font-normal mb-1">Timezone</Text> */}
        {/* <Text className="text-sm font-normal mb-1">Bedtime</Text> */}

        {/* <Text className="text-sm font-normal mb-1">Warning</Text> */}
        {/* <Text className="text-sm font-normal mb-1">Day starts at</Text> */}
      </View>
    </View>
  );
}
