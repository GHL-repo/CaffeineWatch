import React, {useEffect, useState, useCallback} from 'react';
import { Text, TextInput, View, Button, FlatList, Alert, Modal, TouchableOpacity } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import data from "../src/data";
import DrinksListEl from "@/components/DrinksListEl";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function Profile() {

  const [cafTypes, setCafTypes] = useState(data.caffeineTypes);
  const [cafName, setCafName] = useState();
  const [cafMg, setCafMg] = useState();
  const [curEditId, setCurEditId] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  

  const handleReset = () => {
    setCafTypes(prevCafTypes => data.caffeineTypes);
    storeCaffeineTypes(data.caffeineTypes);
    setModalOpen(false);  
  };


  const handleAddCafType = () => {
    if (cafName.length > 0 && cafMg != undefined) {      
      const cafId = cafTypes.length + Math.random();
      const newCafType = {id: cafId, name: cafName, mgPerCup: cafMg};
      const newCafTypes = [...cafTypes, newCafType];
      setCafTypes(newCafTypes);
      storeCaffeineTypes(newCafTypes);
      setModalOpen(false);  
    } else {
      Alert.alert("Oops","field cannot be empty");
    }
  };

  // Edit caftype functions
  const handleNameChange = (val) => {
    setCafName(val);
  };

  const handleMgChange = (val) => {
    setCafMg(Number(val));
  };

  // DrinksListEl functions
  const handlePressEdit = (id) => {
    const itemToEdit = cafTypes.find((item) => item.id === id);

    setCurEditId(itemToEdit.id);
    setCafName(itemToEdit.name);
    setCafMg(String(itemToEdit.mgPerCup));
    setEditModalOpen(true);
  };

  const handleSaveEdit = (id, newName, newMg) => {

    const newCafTypes = cafTypes.map(item => {
      if (item.id === id) {
        return {
          ...item,        // Copy existing object properties
          name: newName,  // Update name
          mgPerCup: Number(newMg) // Update mgPerCup
        };
      }
      return item; // Return unchanged object for others
    });

    setCafTypes(newCafTypes);
    storeCaffeineTypes(newCafTypes);
    setEditModalOpen(false);
  };

  const handlePressDelete = (id) => {
    setCafTypes((prevCafTypes) => {
      const newCafTypes = prevCafTypes.filter(item => item.id != id);  
      storeCaffeineTypes(newCafTypes);
      return newCafTypes;     
    });    
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
    // handleReset();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getCaffeineTypes();
    },[])
  );


  return (
    <View className="h-full bg-white p-8">

    <View>  
      <View className="mb-2 self-center">
        <Ionicons 
          name="add-circle-outline" 
          size={32} 
          onPress={() => {setCafName(""); setModalOpen(true);}}
        />
      </View> 
  
    {/* Add new drink modal*/}
    <Modal visible={modalOpen} animationType="slide" >
    <View className="h-full bg-white p-8 mt-14">
      <View className="mb-2 self-center">
      <Ionicons 
        name="close-circle-outline" size={32}
        onPress={() => setModalOpen(false)}
      />
      </View > 
      
      <Text className='mt-8 self-center'>Why hello there! Please enter your drink:</Text>
      <TextInput className='mt-2 p-1 pl-4 border'
        onChangeText={handleNameChange}
        value={cafName}
        placeholder="Name of drink"
        keyboardType="default"
      />
      <TextInput className='mb-4 p-1 pl-4 border'
        onChangeText={handleMgChange}
        value={cafMg}
        placeholder="Mg of caffeine per cup"
        keyboardType="numeric"
      />

      <View className="flex flex-row justify-between mt-1">

            <TouchableOpacity
            onPress={handleReset}
            className="p-2 bg-purple-600 rounded-lg flex-1 mr-2"
            >
            <Text className="text-center text-white font-semibold">Reset</Text>
            </TouchableOpacity>


            <TouchableOpacity
            onPress={handleAddCafType}
            className="p-2 bg-blue-600 rounded-lg flex-1 ml-2"
            >
            <Text className="text-center text-white font-semibold">Save</Text>
            </TouchableOpacity>
      </View>
    </View>
    </Modal> 
    
    {/* Edit drink modal*/}
    <Modal visible={editModalOpen} animationType="slide" >
    <View className="h-full bg-white p-8 mt-14">
      <View className="mb-2 self-center">
      <Ionicons 
        name="close-circle-outline" size={32}
        onPress={() => setEditModalOpen(false)}
      />
      </View > 
      
      <Text className='mt-8 self-center'>Why hello there! Please edit your drink:</Text>
      <TextInput className='mt-2 p-1 pl-4 border'
        onChangeText={handleNameChange}
        value={cafName}
        placeholder="Name of drink"
        keyboardType="default"
      />
      <TextInput className='mb-4 p-1 pl-4 border'
        onChangeText={handleMgChange}
        value={cafMg}
        placeholder="Mg of caffeine per cup"
        keyboardType="numeric"
      />

      <View className="flex flex-row justify-between mt-1">
        <TouchableOpacity
          onPress={() => {
            handleSaveEdit(curEditId, cafName, cafMg);   
          }}
          className="p-2 bg-blue-600 rounded-lg flex-1 mr-2"
          >
          <Text className="text-center text-white font-semibold">Save Changes</Text>
        </TouchableOpacity>
      </View>

      {/* <Button
        onPress={() => {
          handleSaveEdit(curEditId, cafName, cafMg);   
        }}
        title="Save"
        color="#841584"
      /> */}

    </View>
    </Modal> 
    </View>


    <FlatList
      data={cafTypes}
      renderItem={({item}) => (
        <DrinksListEl 
          keyExtractor={item => item.id}
          item={item}  
          handlePressDelete={handlePressDelete}
          handlePressEdit={handlePressEdit}
          setEditModalOpen={setEditModalOpen}    
        />)
      }
    />
    </View>
  );
}



