import { Text, View, TouchableOpacity, Image } from "react-native";
import edit from "../assets/icons/edit.png";
import trash from "../assets/icons/trash.png";
import { icons } from "../constants/Icons"



export default function DrinksListEl ({
  item,
  handlePressDelete,
  handlePressEdit
}) {
  return (
    <View className="flex flex-row justify-between items-center mb-2 h-10">
      
      <View className="flex flex-row justify-between items-center w-3/4">
        <View className="flex flex-row mr-1">
          <Image             
            source={icons[item.icon]}
            className="w-[22px] h-[22px]"
            resizeMode="contain"
          />
          <Text className="text-primary font-psemibold text-sm ml-2">
            {item.name.length > 18 ? `${item.name.slice(0, 18)}...` : item.name}
          </Text>
        </View>
        
        <Text>
          {item.mgPerCup} mg
        </Text>
      </View>
      
      <View className="flex flex-row justify-between items-center">
        <TouchableOpacity onPress={() => { handlePressEdit(item.id)}}>
          <Image             
            source={edit}
            className="w-[22px] h-[22px] mr-1"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePressDelete(item.id)}>
          <Image 
            source={trash}
            className="w-[22px] h-[22px] ml-2"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>

  );
};

