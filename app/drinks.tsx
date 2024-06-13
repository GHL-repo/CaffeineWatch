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
      
      <Text>Coffee          135ml   67mg </Text>
      <Text>Espresso        135ml   67mg </Text>
      <Text>Monster Energy  135ml   67mg </Text>
      <Text>Flat White      135ml   67mg </Text>
      <Text>Cola            135ml   67mg </Text>

    </View>
  );
}



