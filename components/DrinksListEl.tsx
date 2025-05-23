import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { PencilSquareIcon, TrashIcon } from "react-native-heroicons/outline";
import { icons } from "../constants/Icons";
import DeleteModal from "@/components/DeleteModal";

export default function DrinksListEl({
  item,
  handlePressDelete,
  handlePressEdit,
}) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <View className="flex flex-row justify-between items-center mb-2 h-10">
      <View className="flex flex-row justify-between items-center w-4/5">
        <View className="flex flex-row mr-1">
          <Image
            source={icons[item.icon]}
            className="w-[22px] h-[22px]"
            resizeMode="contain"
          />
          <Text className="text-primary font-psemibold text-sm ml-2 mt-[1px]">
            {item.name.length > 18 ? `${item.name.slice(0, 18)}...` : item.name}
          </Text>
        </View>

        <Text>{item.mgPerCup} mg</Text>
      </View>

      <View className="flex flex-row justify-between items-center">
        <TouchableOpacity
          className="mr-1"
          onPress={() => {
            handlePressEdit(item.id);
          }}
        >
          <PencilSquareIcon color="black" fill="white" size={22} />
        </TouchableOpacity>
        <TouchableOpacity className="ml-0" onPress={() => setIsVisible(true)}>
          <TrashIcon color="black" fill="white" size={22} />
        </TouchableOpacity>
      </View>
      <DeleteModal
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        onConfirm={() => {
          handlePressDelete(item.id);
          setIsVisible(false);
        }}
      >
        {item && (
          <View>
            <Text className="text-lg font-semibold mb-3">
              Remove {item.name} from your Drinks Menu?
            </Text>
          </View>
        )}
      </DeleteModal>
    </View>
  );
}
