import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

import TimeSlider from "@/components/TimeSlider";
import LogDropDown from "@/components/LogDropDown";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const LogModal = ({ isVisible, onClose, onConfirm }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView>
        {/* Backdrop */}
        <View className="flex-1 justify-center items-center bg-zinc-900/50">
          {/* Modal Content */}
          <View className="flex flex-col bg-white w-[80%] p-6 rounded-lg">
            <View className="">
              <LogDropDown />
            </View>

            <View className="">
              <TimeSlider />
            </View>

            <View className="flex flex-row justify-between mt-4">
              {/* Cancel Button */}
              <TouchableOpacity
                onPress={onClose}
                className="p-2 bg-purple-600 rounded-lg flex-1 mr-2"
              >
                <Text className="text-center text-white font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>

              {/* Save Button */}
              <TouchableOpacity
                onPress={onConfirm}
                className="p-2 bg-blue-600 rounded-lg flex-1 ml-2"
              >
                <Text className="text-center text-white font-semibold">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default LogModal;
