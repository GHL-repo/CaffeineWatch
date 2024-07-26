import { Text, View, Button, Image } from "react-native";
import edit from "../assets/icons/edit.png";
import graph from "../assets/icons/trash.png";
import coffee from "../assets/icons/coffee.png";


const DrinksListEl = ({
  title,
  mgPerCup,
  handlePress,
  // containerStyles,
  // textStyles,
  // isLoading,
}) => {
  return (
    <View className="flex flex-row justify-between items-center mb-2 h-10">
      
      <View className="flex flex-row justify-between items-center w-3/4 ml-2">
        <View className="flex flex-row mr-1">
          <Image             
            source={coffee}
            className="w-[22px] h-[22px]"
            resizeMode="contain"
          />
          <Text className="text-primary font-psemibold text-sm ml-2">
            {title}
          </Text>
        </View>
        
        <Text>
          {mgPerCup} ml
        </Text>
      </View>
      <View className="flex flex-row justify-between items-center">
        <View className="mr-1">
          <Image 
            
            source={edit}
            className="w-[22px] h-[22px]"
            resizeMode="contain"
          />
        </View>
        <View className="ml-1">
          <Image 
            source={graph}
            className="w-[22px] h-[22px]"
            resizeMode="contain"
          />
        </View>
      </View>
    </View>

  );
};

export default DrinksListEl;
