import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Slider } from "react-native-awesome-slider";
import { format, addMinutes, subMinutes } from "date-fns";
import { useSharedValue } from "react-native-reanimated";
import { ClockIcon } from "react-native-heroicons/mini";
import { useTimeStore } from "@/store/store";

const TimeSlider = () => {
  const progress = useSharedValue(100);
  const min = useSharedValue(0);
  const max = useSharedValue(100);
  const rangeMinutes = 6 * 60; // 3 hours in minutes

  // State for displaying the current time
  const { selectedTime, setSelectedTime } = useTimeStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  const handleSliderChange = (value) => {
    const percentageOffset = value / 100; // Normalize slider value (0 to 1)
    const timeOffset = rangeMinutes * percentageOffset; // Calculate offset in minutes
    const newTime = subMinutes(new Date(), rangeMinutes - timeOffset); // Adjust to past time
    setCurrentTime(newTime); // Update display
  };

  const handleSliderStop = (value) => {
    const percentageOffset = value / 100; // Normalize slider value (0 to 1)
    const timeOffset = rangeMinutes * percentageOffset; // Calculate offset in minutes
    const newTime = subMinutes(new Date(), rangeMinutes - timeOffset); // Adjust to past time
    setSelectedTime(newTime); // Update store
  };

  const handleReset = () => {
    progress.value = 100; // Reset slider to 100% (now)
    const now = new Date();
    setCurrentTime(now); // Reset displayed time
    setSelectedTime(now); // Reset store time
  };

  const customThumb = () => (
    <View className="p-[2px] rounded-full bg-zinc-700">
      <ClockIcon color="white" />
    </View>
  );

  return (
    <View className="p-2">
      <View className="flex flex-row">
        <View className="flex-1" />

        <View className="flex-1 items-center">
          <Pressable onPress={handleReset} className="p-1">
            <Text className="text-xl font-semibold">
              {format(currentTime, "HH:mm")}
            </Text>
          </Pressable>
        </View>

        <View className="flex-1" />
      </View>

      <Slider
        className="mt-1 mb-1 w-full"
        theme={{
          maximumTrackTintColor: "#ccc",
          minimumTrackTintColor: "#666",
          bubbleBackgroundColor: "transparent",
          bubbleTextColor: "transparent",
        }}
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        thumbWidth={20}
        onValueChange={(value) => handleSliderChange(value)}
        onSlidingComplete={(value) => handleSliderStop(value)}
        renderThumb={customThumb}
      />
    </View>
  );
};

export default TimeSlider;
