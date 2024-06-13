import { StatusBar } from 'expo-status-bar';
import { Button, Text, View } from "react-native";
import { Link } from "expo-router";


export default function Index() {
  return (
    <View className="flex-1 items-start justify-start bg-white m-10">
      
      <Text className="italic">Index</Text>
      <StatusBar style="auto" />
      <Link className="font-bold text-blue-700" href="/drinks">Go to my drinks</Link>
      <Link className="font-bold text-blue-700" href="/profile">Go to profile</Link>
      <Text>Current caffeine amount: 420mg</Text>
      <Text>Avoid Caffeine after: 16:20</Text>
      <Button title="Add Drink"/>
      <Button title="Add Drink"/>
      <Button title="Add Drink"/>
      <Button title="Add Drink"/>
      <Button title="Add Drink"/>
      <Button title="Add Drink"/>
      <Button title="Custom..."/>
      
      
    </View>
  );
}



