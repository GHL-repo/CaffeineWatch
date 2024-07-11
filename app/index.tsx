import { StatusBar } from 'expo-status-bar';
import { Button, Text, View } from "react-native";
import { Link } from "expo-router";


export default function Index() {
  return (
    <View className="flex-1 items-start justify-start bg-white p-10">
      
      <Text className="font-pblack">Index</Text>
      <StatusBar style="auto" />
      <Link className="font-pbold" href="/drinks">Go to my drinks</Link>
      <Link className="font-pbold" href="/profile">Go to profile</Link>
      <Text className="font-pregular">Current caffeine amount: 420mg</Text>
      <Text className="font-pregular">void Caffeine after: 16:20</Text>

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



