import React, { useCallback, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { TrashIcon } from "react-native-heroicons/outline";
import { PencilSquareIcon } from "react-native-heroicons/outline";
import Header from "@/components/Header";
import {
  useTimelineStore,
  useTimeStore,
  useDrinkStore,
  useSettingsStore,
} from "@/store/store";
import CafDelModal from "@/components/CafDelModal";
import LogModal from "@/components/LogModal";

export default function Profile() {
  const [date, setDate] = useState(new Date());

  const { cafLog, setCafLog } = useTimelineStore();
  const { selectedTime } = useTimeStore();
  const { selectedDrink, setSelectedDrink } = useDrinkStore();
  const { timeZone } = useSettingsStore();

  // Modal management
  const [isCafModalVisible, setIsCafModalVisible] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCaf, setSelectedCaf] = useState(null);

  const openCafModal = (drink) => {
    setSelectedCaf(drink);
    setIsCafModalVisible(true);
  };

  const closeCafModal = () => {
    setIsCafModalVisible(false);
    setSelectedCaf(null);
  };

  const openLogModal = () => {
    setEditModalOpen(true);
  };

  const closeLogModal = () => {
    setEditModalOpen(false);
  };

  // AsyncStore functions
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

  const storeCafLog = async (cafLog) => {
    try {
      const cafLogStorage = JSON.stringify(cafLog);
      await AsyncStorage.setItem("@cafLogStorage", cafLogStorage);
    } catch (err) {
      alert(err);
    }
  };

  const handleAddDrink = () => {
    if (!selectedDrink || Object.keys(selectedDrink).length === 0) {
      alert("Please select a drink");
      return;
    }

    const selectedTimeCopy = new Date(selectedTime);
    selectedTimeCopy.setHours(selectedTimeCopy.getHours() + timeZone + 1);
    const timeStamp = selectedTimeCopy.toISOString();

    const newDrink = {
      timeStamp: timeStamp,
      nameOfDrink: selectedDrink.name,
      amountOfMg: selectedDrink.mgPerCup,
    };

    const updatedCafLog = [...cafLog, newDrink];
    setCafLog(updatedCafLog);
    storeCafLog(updatedCafLog);
    setSelectedDrink("");
  };

  const deleteCafLogEntry = async (idToDelete: string) => {
    try {
      const updatedCafLog = cafLog.filter(
        (item) => item.timeStamp !== idToDelete,
      );
      setCafLog(updatedCafLog);
      await AsyncStorage.setItem(
        "@cafLogStorage",
        JSON.stringify(updatedCafLog),
      );
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  //Render functions for Flatlist
  const groupByDate = (data) => {
    return data.reduce((acc, item) => {
      const date = item.timeStamp.slice(5, 10); // MM-DD
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});
  };

  const flatListData = Object.entries(groupByDate([...cafLog].reverse())).map(
    ([date, drinks]) => ({
      date,
      drinks: [...drinks].reverse(),
    }),
  );

  useFocusEffect(
    useCallback(() => {
      getCafLog();
    }, []),
  );

  return (
    <View>
      <Header />
      <View className="h-full bg-white pt-2 pl-10 pr-10">
        <View className="flex-row justify-between w-full mb-2">
          <Text className="text-xl font-bold mb-3">Recent drinks</Text>
          <TouchableOpacity onPress={() => openLogModal()}>
            <PencilSquareIcon color="black" fill="white" size={30} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={flatListData}
          keyExtractor={(item) => item.date}
          ListEmptyComponent={() => <Text>No recent drinks found.</Text>}
          renderItem={({ item }) => (
            <View className="mb-4 w-full">
              {/* Display date */}
              <Text className="text-lg font-psemibold">{item.date}</Text>

              {/* Render drinks under the date */}
              {[...item.drinks]
                .sort((a, b) => b.timeStamp.localeCompare(a.timeStamp))
                .map((drink, index) => (
                  <View
                    key={index}
                    className="flex-row pl-0 mb-2 justify-between w-full"
                  >
                    <Text className="text-base pr-3">
                      {drink.timeStamp.slice(11, 16)} {drink.nameOfDrink}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        openCafModal({
                          name: drink.nameOfDrink,
                          amountOfMg: drink.amountOfMg,
                          id: drink.timeStamp,
                        })
                      }
                    >
                      <TrashIcon color="black" fill="white" size={22} />
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          )}
        />
      </View>
      <CafDelModal
        isVisible={isCafModalVisible}
        onClose={closeCafModal}
        onConfirm={() => {
          deleteCafLogEntry(selectedCaf.id);
          closeCafModal();
        }}
      >
        {selectedCaf && (
          <View>
            <Text className="text-lg font-semibold mb-3">
              Remove {selectedCaf.name} on {selectedCaf.id.slice(5, 10)} at{" "}
              {selectedCaf.id.slice(11, 16)}?
            </Text>
          </View>
        )}
      </CafDelModal>
      <LogModal
        isVisible={editModalOpen}
        onClose={closeLogModal}
        onConfirm={() => {
          handleAddDrink();
          closeLogModal();
        }}
      ></LogModal>
    </View>
  );
}
