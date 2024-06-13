import { StatusBar } from 'expo-status-bar';
import { Text, View } from "react-native";
import { Link } from "expo-router";


export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      
      <Text className="italic">Index</Text>
      <StatusBar style="auto" />
      <Link className="font-bold text-blue-700" href="/drinks">Go to my drinks</Link>
      <Link className="font-bold text-blue-700" href="/profile">Go to profile</Link>
      
      
    </View>
  );
}



