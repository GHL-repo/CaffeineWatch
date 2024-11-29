import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import { format, addMinutes } from 'date-fns';
import { useSharedValue } from 'react-native-reanimated';
import { ArrowPathIcon } from "react-native-heroicons/mini";
import { useTimeStore } from '@/store/store';



const TimeSlider = () => {
    const progress = useSharedValue(50);
    const min = useSharedValue(0);
    const max = useSharedValue(100);
    const rangeMinutes = 3 * 60; // 3 hours in minutes
  
    // State for displaying the current time
    const { selectedTime, setSelectedTime } = useTimeStore();
    const [currentTime, setCurrentTime] = useState(new Date());
  
    const handleSliderChange = (value) => {
        const percentageOffset = (value - 50) / 50; // Calculate offset percentage (-1 to +1)
        const timeOffset = rangeMinutes * percentageOffset; // Convert percentage to minutes
        const newTime = addMinutes(new Date(), timeOffset); // Adjust current time by offset
        setCurrentTime(newTime); 
    };

    const handleSliderStop = (value) => {
        const percentageOffset = (value - 50) / 50; // Calculate offset percentage (-1 to +1)
        const timeOffset = rangeMinutes * percentageOffset; // Convert percentage to minutes
        const newTime = addMinutes(new Date(), timeOffset); // Adjust current time by offset
        setSelectedTime(newTime); 
    }

    const handleReset = () => {
        progress.value = 50; 
        setCurrentTime(new Date()); 
        setSelectedTime(new Date()); 
      };

    return (
        <View className="flex-1 justify-center items-center p-2">

        <View className="flex flex-row">

            <View className="flex-1" />


            <Text className="flex-1 text-center text-xl font-semibold">
                {format(currentTime, 'HH:mm')}
            </Text>

            <View className="flex-1 items-end">
                <Pressable
                    onPress={handleReset}
                    className="p-1"
                >
                    <ArrowPathIcon color="black"/>
                </Pressable>
            </View>
            

        </View>
  
        <Slider
          className="mt-3 mb-3 w-full"
          theme={{
            maximumTrackTintColor: '#666',
            minimumTrackTintColor: '#666',
            bubbleBackgroundColor: 'transparent',
            bubbleTextColor: 'transparent', 
          }}
          progress={progress}
          minimumValue={min}
          maximumValue={max}
          thumbWidth={20}
          onValueChange={(value) => handleSliderChange(value)}
          onSlidingComplete={(value) => handleSliderStop(value)}

        />
        
        
      </View>        
    );
};

export default TimeSlider;
