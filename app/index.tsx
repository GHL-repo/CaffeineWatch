import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>Home</Text>

      <Link href="/drinks" asChild>
        <Pressable>
          <Text>Go to drinks</Text>
        </Pressable>
      </Link>

      <Link href="/journal" asChild>
        <Pressable>
          <Text>Go to journal</Text>
        </Pressable>
      </Link>

      <Link href="/settings" asChild>
        <Pressable>
          <Text>Go to settings</Text>
        </Pressable>
      </Link>
    </View>
  );
}
