import { Button, Text, View } from "react-native";

export default function About() {
  return (
    <View className="flex items-start justify-normal p-10">
      
      <Text className="font-pblack">Test layout</Text>

      <Text className="font-pbold">Bladie</Text>
      <Text className="font-pbold">Blablabla</Text>
      
      <View className="w-full h-52 bg-yellow-900"></View>

      <Text className="font-pregular">blablabla</Text>
      <Text className="font-pregular">blablabla</Text>

      <View className="flex flex-wrap flex-row justify-between">
        <View className="bg-orange-500 p-4 h-20 w-20 mt-3"><Text>Coffee 1</Text></View>
        <View className="bg-orange-500 p-4 h-20 w-20 mt-3"><Text>Coffee 2</Text></View>
        <View className="bg-orange-500 p-4 h-20 w-20 mt-3"><Text>Coffee 3</Text></View>
        <View className="bg-orange-500 p-4 h-20 w-20 mt-3"><Text>Coffee 4</Text></View>        
        <View className="bg-orange-500 p-4 h-20 w-20 mt-3"><Text>Coffee 5</Text></View>
        {/* <View className="bg-orange-500 p-4 h-20 w-20 mb-2"><Text>Coffee 6</Text></View> */}
      </View>



    </View>
  );
}



