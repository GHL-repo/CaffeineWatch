import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DraggableFlatList, {
  OpacityDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import DrinksListEl from "@/components/DrinksListEl";
import Header from "@/components/Header";
import { iconData } from "../constants/Icons";
import data from "../src/data";

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
    <View>
      <Header />

      <View className="h-full bg-white pt-2 pl-10 pr-10">
        <View className="mt-0">
          <View className="flex-row justify-between w-full mb-2">
            <Text className="text-xl font-bold mb-3">Drinks Menu</Text>
            <TouchableOpacity
              onPress={() => {
                setCafName("");
                setCafIcon("coffeeDefault");
                setModalOpen(true);
              }}
            >
              <Text className="text-lg rounded bg-gray-50 border border-gray-300 px-2">
                Create
              </Text>
            </TouchableOpacity>
          </View>

          {/* Add new drink modal*/}
          <Modal visible={modalOpen} animationType="slide" transparent={true}>
            <View className="flex-1 justify-center items-center bg-zinc-900/50">
              <View className="flex flex-col bg-white w-[90%] p-6 rounded-lg">
                <Text className="text-xl font-bold mb-5">Create drink</Text>

                <View className="rounded-lg bg-gray-50 border border-gray-300 mb-2">
                  <Text className="mb-1 px-3 py-1 font-bold border-b border-gray-300">
                    Name of drink
                  </Text>
                  <TextInput
                    className="text-bold text-black pl-3 pt-1"
                    onChangeText={handleNameChange}
                    value={cafName}
                    placeholder="name"
                    keyboardType="default"
                  />
                </View>

                <View className="rounded-lg bg-gray-50 border border-gray-300 mb-2">
                  <Text className="mb-1 px-3 py-1 font-bold border-b border-gray-300">
                    Mg of caffeine per cup
                  </Text>
                  <TextInput
                    className="text-bold text-black pl-3 pt-1"
                    onChangeText={handleMgChange}
                    value={cafMg}
                    placeholder="mg"
                    keyboardType="numeric"
                  />
                </View>

                <View>
                  <View className="rounded-lg bg-gray-50 border border-gray-300 mb-2">
                    <Text className="mb-1 px-3 py-1 font-bold border-b border-gray-300">
                      Icon:
                    </Text>
                    <View className="flex flex-wrap flex-row justify-between p-3 pt-4 pb-1">
                      {iconData.map((item) => (
                        <View
                          key={item.id}
                          className="items-center mb-4 w-[25%]"
                        >
                          <TouchableOpacity
                            onPress={() => handleIconChange(item.id)}
                          >
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
                  </View>
                </View>

                <View className="flex flex-row justify-between mt-5">
                  <TouchableOpacity
                    onPress={() => setModalOpen(false)}
                    className="p-2 bg-purple-600 rounded-lg flex-1 mr-2"
                  >
                    <Text className="text-center text-white font-semibold">
                      Cancel
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
            </View>
          </Modal>

          {/* Edit drink modal*/}
          <Modal
            visible={editModalOpen}
            animationType="slide"
            transparent={true}
          >
            <View className="flex-1 justify-center items-center bg-zinc-900/50">
              <View className="flex flex-col bg-white w-[90%] p-6 rounded-lg">
                <Text className="text-xl font-bold mb-5">Edit drink</Text>

                <View className="rounded-lg bg-gray-50 border border-gray-300 mb-2">
                  <Text className="mb-1 px-3 py-1 font-bold border-b border-gray-300">
                    Name of drink
                  </Text>
                  <TextInput
                    className="text-bold text-black pl-3 pt-1"
                    onChangeText={handleNameChange}
                    value={cafName}
                    placeholder="name"
                    keyboardType="default"
                  />
                </View>

                <View className="rounded-lg bg-gray-50 border border-gray-300 mb-2">
                  <Text className="mb-1 px-3 py-1 font-bold border-b border-gray-300">
                    Mg of caffeine per cup
                  </Text>
                  <TextInput
                    className="text-bold text-black pl-3 pt-1"
                    onChangeText={handleMgChange}
                    value={cafMg}
                    placeholder="mg"
                    keyboardType="numeric"
                  />
                </View>

                <View>
                  <View className="rounded-lg bg-gray-50 border border-gray-300 mb-2">
                    <Text className="mb-1 px-3 py-1 font-bold border-b border-gray-300">
                      Icon:
                    </Text>
                    <View className="flex flex-wrap flex-row justify-between p-3 pt-4 pb-1">
                      {iconData.map((item) => (
                        <View
                          key={item.id}
                          className="items-center mb-4 w-[25%]"
                        >
                          <TouchableOpacity
                            onPress={() => handleIconChange(item.id)}
                          >
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
                  </View>
                </View>

                <View className="flex flex-row justify-between mt-5">
                  <TouchableOpacity
                    onPress={() => setEditModalOpen(false)}
                    className="p-2 bg-purple-600 rounded-lg flex-1 mr-2"
                  >
                    <Text className="text-center text-white font-semibold">
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      handleSaveEdit(curEditId, cafName, cafMg, cafIcon);
                    }}
                    className="p-2 bg-blue-600 rounded-lg flex-1 ml-2"
                  >
                    <Text className="text-center text-white font-semibold">
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
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
    </View>
  );
}
