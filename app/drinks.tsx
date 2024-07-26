import { Text, View } from "react-native";
import data from "../src/data";
import DrinksListEl from "@/components/DrinksListEl";
import CustomButton from "@/components/CustomButton";


export default function Profile() {
  return (
    <View className="h-full bg-white p-10">
      {
        data.caffeineTypes.map( caffeineType => {
          return (
            <DrinksListEl 
              key={caffeineType.id}
              title={caffeineType["name"]}
              mgPerCup={caffeineType["mgPerCup"]}
            />
          )
        })
      }
    </View>
  );
}



