import { Text, View } from "react-native";

export default function Profile() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="font-pblack">About</Text>      
      <Text>This is a profile</Text>
    </View>
  );
}



