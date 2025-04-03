import { View } from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, Pressable } from "react-native";

import checklist from "../assets/icons/checklist.png";
import settings from "../assets/icons/settings.png";
import chart from "../assets/icons/curve.png";

const Header = () => {
  return (
    <View className="flex justify-start h-[100px] p-10 mt-2 bg-white">
      <StatusBar style="auto" />

      <View className="flex flex-row justify-between h-[40px] mt-2">
        <Link className="" href="/journal" asChild>
          <Pressable>
            <Image
              source={checklist}
              className="w-[40px] h-[40px]"
              resizeMode="contain"
            />
          </Pressable>
        </Link>

        <Link className="" href="/" asChild>
          <Pressable>
            <Image
              source={chart}
              className="w-[40px] h-[40px]"
              resizeMode="contain"
            />
          </Pressable>
        </Link>

        <Link className="" href="/settings" asChild>
          <Pressable>
            <Image
              source={settings}
              className="w-[40px] h-[40px] opacity-100"
              resizeMode="contain"
            />
          </Pressable>
        </Link>
      </View>
    </View>
  );
};
export default Header;
