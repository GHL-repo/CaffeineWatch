import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { addHours, format } from "date-fns";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ArrowUturnLeftIcon } from "react-native-heroicons/outline";
import CaffeineChart from "@/components/CaffeineChart";
import CafMenu from "@/components/CafMenu";
import Header from "@/components/Header";
import TimeSlider from "@/components/TimeSlider";
import { iconData } from "@/constants/Icons";
import {
  useCaffeineStore,
  useSettingsStore,
  useTimelineStore,
} from "@/store/store";
import bean from "../assets/icons/coffee-bean.png";
import coffee from "../assets/icons/coffee-shop.png";
import user from "../assets/icons/user.png";

export default function Index() {
  const { cafTypes, setCafTypes } = useCaffeineStore();
  const { cafLog, setCafLog } = useTimelineStore();
  const { cafTimeline, setCafTimeline } = useTimelineStore();
  const [showBackBtn, useShowBackBtn] = useState(true);

  // Settings
  const { threshold } = useSettingsStore();
  const { timeZone } = useSettingsStore();
  const range = 24;
  const offSet = range / 2;

  // Calculated
  const [mgCount, setMgCount] = useState(0);
  const [sleepTime, setSleepTime] = useState("22:30");

  const resetLog = async () => {
    const newCafLog = [];
    try {
      setCafLog(newCafLog);
      storeCafLog(newCafLog);
    } catch (err) {
      alert(err);
    }
    updateTimeline();
  };

  const generateTimeline = (range, offSet, timeZone, threshold) => {
    const currentDate = new Date(
      new Date().setHours(new Date().getHours() + timeZone),
    );
    const startingDate = new Date(currentDate);
    startingDate.setHours(startingDate.getHours() - offSet);

    // Include data from outside the chart range
    const extendedRange = range + 16;
    const extendedStartingDate = new Date(startingDate);
    extendedStartingDate.setHours(extendedStartingDate.getHours() - 16);

    return Array.from({ length: extendedRange * 60 }, (_, t) => {
      const date = new Date(extendedStartingDate.getTime() + t * 60 * 1000);
      return {
        timeStamp: date.toISOString(),
        hourMinStamp: date.toISOString().slice(0, 16),
        amount: 0,
        threshold: threshold,
      };
    });
  };

  const populateTimeline = (timeline, cafLog) => {
    let prevAmount = 0;

    timeline.forEach((entry, i) => {
      cafLog.forEach((log) => {
        if (entry.hourMinStamp === log.timeStamp.slice(0, 16)) {
          entry.amount += log.amountOfMg;
        }
      });

      if (i !== 0) {
        prevAmount = timeline[i - 1].amount;
        const decayRatePerMinute = Math.pow(0.5, 1 / 300);
        entry.amount += prevAmount * decayRatePerMinute;
      }
    });

    // Return only the specified range
    return timeline.slice(-range * 60);
  };

  const updateTimeline = async () => {
    const timeline = generateTimeline(range, offSet, timeZone, threshold);
    const populatedTimeline = populateTimeline(timeline, cafLog);
    setCafTimeline(populatedTimeline);
  };

  // Caflog functions
  const handleUndoCafLog = async () => {
    if (cafLog.length === 0) {
      console.error("cafLog is empty, no element to delete.");
      return;
    }

    const newCafLog = cafLog.slice(0, cafLog.length - 1);
    await storeCafLog(newCafLog);
    setCafLog(newCafLog);
  };

  // Sleeptime calculator
  const calculateSleepTime = async () => {
    let foundTime = "";
    let timeOfDay = "";
    let now = new Date(
      new Date().setHours(new Date().getHours() + timeZone),
    ).toISOString();

    for (let i = cafTimeline.length - 1; i >= 0; i--) {
      if (cafTimeline[i].amount <= threshold) {
        foundTime = cafTimeline[i].timeStamp;
        if (i === 0) {
          foundTime = now;
        }
      } else {
        break;
      }
    }

    if (!foundTime) {
      setSleepTime(`more than ${range - offSet} hours`);
    } else {
      setSleepTime(
        format(addHours(new Date(foundTime), -1), "HH:mm" + timeOfDay),
      );
    }
  };

  const calculateCurrentMg = async () => {
    let foundMg = 0;
    const currentDate = new Date(
      new Date().setHours(new Date().getHours() + timeZone),
    );
    const now = currentDate.toISOString().slice(0, 16);

    for (let i = cafTimeline.length - 1; i >= 0; i--) {
      if (cafTimeline[i].hourMinStamp === now) {
        foundMg = cafTimeline[i].amount;
        break;
      }
    }
    const roundedMg = Math.round(foundMg * 10) / 10;
    setMgCount(roundedMg);
  };

  // AsyncStore functions
  const storeCafLog = async (cafLog) => {
    try {
      const cafLogStorage = JSON.stringify(cafLog);
      await AsyncStorage.setItem("@cafLogStorage", cafLogStorage);
    } catch (err) {
      alert(err);
    }
  };

  const getCafLog = async () => {
    try {
      let cafLogStorage = await AsyncStorage.getItem("@cafLogStorage");
      if (cafLogStorage !== null) {
        setCafLog(JSON.parse(cafLogStorage));
      }
    } catch (err) {
      alert(err);
    }
  };

  const getCaffeineTypes = async () => {
    try {
      let cafTypesStorage = await AsyncStorage.getItem("@cafTypesStorage");
      if (cafTypesStorage !== null) {
        setCafTypes(JSON.parse(cafTypesStorage));
      }
    } catch (err) {
      alert(err);
    }
  };

  // Effect hooks
  useEffect(() => {
    updateTimeline();
    // resetLog();
  }, [cafLog]);

  useEffect(() => {
    const interval = setInterval(() => {
      calculateCurrentMg();
      calculateSleepTime();
    }, 500);

    return () => clearInterval(interval);
  }, [cafTimeline]);

  useFocusEffect(
    useCallback(() => {
      getCaffeineTypes();
      getCafLog();
      useShowBackBtn(false);
    }, []),
  );

  return (
    <GestureHandlerRootView className="bg-white">
      <Header />
      <View className="flex justify-start h-full pl-10 pr-10 pt-3">
        <StatusBar style="auto" />
        <View className="flex justify-between flex-row">
          <Text className="font-pregular">Current caffeine amount: </Text>
          <Text className="font-pregular">{mgCount}mg</Text>
        </View>
        <View className="flex justify-between flex-row">
          <Text className="font-pregular">Optimal sleep after: </Text>
          <Text className="font-pregular">{sleepTime}</Text>
        </View>

        {showBackBtn && (
          <View className="flex-row justify-end mt-1 mr-2 -mb-[35px] z-10">
            <TouchableOpacity
              className="rounded-lg border p-[2px] bg-white"
              onPress={handleUndoCafLog}
            >
              <ArrowUturnLeftIcon color="black" size="26px" />
            </TouchableOpacity>
          </View>
        )}

        <View className="h-[200px] mt-2">
          <CaffeineChart DATA={cafTimeline} />
        </View>

        <TimeSlider />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <CafMenu
            cafTypes={cafTypes}
            iconData={iconData}
            setMgCount={setMgCount}
            useShowBackBtn={useShowBackBtn}
          />
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}
