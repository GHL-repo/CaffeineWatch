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

  const handleReset = () => {
    setCafTypes(data.caffeineTypes);
    storeCaffeineTypes(data.caffeineTypes);
    setModalOpen(false);
  };

  const handleAddCafType = () => {
    if (cafName?.length > 0 && cafMg != undefined) {
      const cafId = cafTypes.length + Math.random();
      const newCafType = {
        id: cafId,
        name: cafName,
        mgPerCup: cafMg,
        icon: cafIcon,
      };
      const newCafTypes = [...cafTypes, newCafType];
      setCafTypes(newCafTypes);
      storeCaffeineTypes(newCafTypes);
      setModalOpen(false);
    } else {
      Alert.alert("Oops", "field cannot be empty");
    }
  };

  // Edit caftype functions
  const handleNameChange = (val) => {
    setCafName(val);
  };

  const handleMgChange = (val) => {
    setCafMg(Number(val));
  };

  const handleIconChange = (val) => {
    setCafIcon(val);
  };

  // DrinksListEl functions
  const handlePressEdit = (id) => {
    const itemToEdit = cafTypes.find((item) => item.id === id);
    setCurEditId(itemToEdit.id);
    setCafName(itemToEdit.name);
    setCafMg(String(itemToEdit.mgPerCup));
    setCafIcon(itemToEdit.icon);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (id, newName, newMg, newIcon) => {
    const newCafTypes = cafTypes.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          name: newName,
          mgPerCup: Number(newMg),
          icon: newIcon,
        };
      }
      return item;
    });
    setCafTypes(newCafTypes);
    storeCaffeineTypes(newCafTypes);
    setCafIcon("coffeeDefault");
    setEditModalOpen(false);
  };

  const handlePressDelete = (id) => {
    setCafTypes((prevCafTypes) => {
      const newCafTypes = prevCafTypes.filter((item) => item.id != id);
      storeCaffeineTypes(newCafTypes);
      return newCafTypes;
    });
  };

  // AsyncStore functions
  const storeCaffeineTypes = async (cafTypes) => {
    try {
      const cafTypesStorage = JSON.stringify(cafTypes);
      await AsyncStorage.setItem("@cafTypesStorage", cafTypesStorage);
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

  const onDragEnd = useCallback(({ data }) => {
    setCafTypes(data);
    storeCaffeineTypes(data);
  }, []);

  useEffect(() => {
    // handleReset();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getCaffeineTypes();
    }, []),
  );

  return (
    <View className="h-full bg-white p-8">
      <View>
        <View className="mb-2 self-center">
          <Ionicons
            name="add-circle-outline"
            size={32}
            onPress={() => {
              setCafName("");
              setCafIcon("coffeeDefault");
              setModalOpen(true);
            }}
          />
        </View>

        {/* Add new drink modal*/}
        <Modal visible={modalOpen} animationType="slide">
          <View className="bg-white p-8 mt-14">
            <View className="mb-2 self-center">
              <Ionicons
                name="close-circle-outline"
                size={32}
                onPress={() => {
                  setModalOpen(false);
                }}
              />
            </View>

            <Text className="mt-8 self-center">
              Why hello there! Please enter your drink:
            </Text>
            <TextInput
              className="mt-2 p-1 pl-4 border"
              onChangeText={handleNameChange}
              value={cafName}
              placeholder="Name of drink"
              keyboardType="default"
            />
            <TextInput
              className="mb-4 p-1 pl-4 border"
              onChangeText={handleMgChange}
              value={cafMg}
              placeholder="Mg of caffeine per cup"
              keyboardType="numeric"
            />

            <Text className="mb-1 pl-4">Preferred icon:</Text>
            <View className="flex flex-wrap flex-row justify-between border pt-4">
              {iconData.map((item) => (
                <View key={item.id} className="items-center mb-4 w-[25%]">
                  <TouchableOpacity onPress={() => handleIconChange(item.id)}>
                    <Image
                      source={item.icon}
                      className={`w-[50px] h-[50px] ${item.id === cafIcon ? "" : ""}`}
                      style={
                        item.id === cafIcon
                          ? { tintColor: "#D72638" }
                          : { tintColor: "black" }
                      }
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View className="flex flex-row justify-between mt-3">
              <TouchableOpacity
                onPress={handleReset}
                className="p-2 bg-purple-600 rounded-lg flex-1 mr-2"
              >
                <Text className="text-center text-white font-semibold">
                  Reset
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddCafType}
                className="p-2 bg-blue-600 rounded-lg flex-1 ml-2"
              >
                <Text className="text-center text-white font-semibold">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Edit drink modal*/}
        <Modal visible={editModalOpen} animationType="slide">
          <View className="h-full bg-white p-8 mt-14">
            <View className="mb-2 self-center">
              <Ionicons
                name="close-circle-outline"
                size={32}
                onPress={() => setEditModalOpen(false)}
              />
            </View>

            <Text className="mt-8 self-center">
              Why hello there! Please edit your drink:
            </Text>
            <TextInput
              className="mt-2 p-1 pl-4 border"
              onChangeText={handleNameChange}
              value={cafName}
              placeholder="Name of drink"
              keyboardType="default"
            />
            <TextInput
              className="mb-4 p-1 pl-4 border"
              onChangeText={handleMgChange}
              value={cafMg}
              placeholder="Mg of caffeine per cup"
              keyboardType="numeric"
            />

            <Text className="mb-1 pl-4">Preferred icon:</Text>
            <View className="flex flex-wrap flex-row justify-between border pt-4">
              {iconData.map((item) => (
                <View key={item.id} className="items-center mb-4 w-[25%]">
                  <TouchableOpacity onPress={() => handleIconChange(item.id)}>
                    <Image
                      source={item.icon}
                      className={`w-[50px] h-[50px] ${item.id === cafIcon ? "" : ""}`}
                      style={
                        item.id === cafIcon
                          ? { tintColor: "#D72638" }
                          : { tintColor: "black" }
                      }
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View className="flex flex-row justify-between mt-1">
              <TouchableOpacity
                onPress={() => {
                  handleSaveEdit(curEditId, cafName, cafMg, cafIcon);
                }}
                className="p-2 bg-blue-600 rounded-lg flex-1 mr-2"
              >
                <Text className="text-center text-white font-semibold">
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      <GestureHandlerRootView>
        <DraggableFlatList
          data={cafTypes}
          onDragEnd={onDragEnd}
          keyExtractor={(item) => item.id}
          renderItem={(props: RenderItemParams<any>) => {
            const { item, drag, isActive } = props;
            return (
              <OpacityDecorator>
                <TouchableOpacity onPressIn={drag} disabled={isActive}>
                  <DrinksListEl
                    item={item}
                    handlePressDelete={handlePressDelete}
                    handlePressEdit={handlePressEdit}
                    setEditModalOpen={setEditModalOpen}
                  />
                </TouchableOpacity>
              </OpacityDecorator>
            );
          }}
        />
      </GestureHandlerRootView>
    </View>
  );
}
