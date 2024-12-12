import React, { useRef, useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import bean from "../assets/icons/coffee-bean.png";
import CafModal from "@/components/CafModal";
import {
  useCaffeineStore,
  useTimelineStore,
  useSettingsStore,
  useTimeStore,
} from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const CafMenu = ({ cafTypes, iconData, mgCount, setMgCount }) => {
  const scrollRef = useRef(null);
  const copies = 5;
  const loopedData = Array(copies).fill(cafTypes).flat();
  const xStart = 192 + (cafTypes.length - 2) * 136;
  const xBegin = 130 + (cafTypes.length - 1) * 136;
  const xEnd = 128 + (cafTypes.length - 3) * 136;

  const { cafLog, setCafLog } = useTimelineStore();
  const { selectedTime } = useTimeStore();
  const { timeZone } = useSettingsStore();

  // Modal management
  const [isCafModalVisible, setIsCafModalVisible] = useState(false);
  const [selectedCaf, setSelectedCaf] = useState(null);

  const openCafModal = (caffeineType) => {
    setSelectedCaf(caffeineType);
    setIsCafModalVisible(true);
  };

  const closeCafModal = () => {
    setIsCafModalVisible(false);
    setSelectedCaf(null);
  };

  const confirmCaffeine = () => {
    if (selectedCaf) {
      const { name, mgPerCup } = selectedCaf;
      setMgCount((prevMgCount) => prevMgCount + mgPerCup);
      handleAddCafLog(name, mgPerCup);
    }
    closeCafModal();
  };

  const handleAddCafLog = (name, amount) => {
    const selectedTimeCopy = new Date(selectedTime);
    selectedTimeCopy.setHours(selectedTimeCopy.getHours() + timeZone);
    const date = selectedTimeCopy.toISOString();

    const newCafEntry = {
      timeStamp: date,
      nameOfDrink: name,
      amountOfMg: amount,
    };
    const newCafLog = [...cafLog, newCafEntry];

    setCafLog(newCafLog);
    storeCafLog(newCafLog);
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

  const resetStartPos = (pos) => {
    scrollRef.current.scrollTo({ x: pos, animated: false });
  };

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isStart = contentOffset.x <= 0;
    const isEnd =
      contentOffset.x + layoutMeasurement.width >= contentSize.width;

    if (isStart) {
      resetStartPos(xBegin);
    }
    if (isEnd) {
      resetStartPos(xEnd);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      resetStartPos(xStart);
    }
  }, []);

  return (
    <View className="mt-4">
      <ScrollView
        ref={scrollRef}
        horizontal
        contentOffset={{ x: xStart, y: 0 }}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
      >
        {loopedData.map((caffeineType, index) => {
          const matchingIcon = iconData.find(
            (icon) => icon.id === caffeineType.icon,
          )?.icon;

          return (
            <View
              className="border h-[160px] w-[120px] p-2 mr-4 rounded-md flex items-center justify-center bg-secondary "
              key={index}
            >
              <TouchableOpacity
                className="flex items-center justify-center"
                onPress={() =>
                  openCafModal({
                    name: caffeineType.name,
                    mgPerCup: caffeineType.mgPerCup,
                  })
                }
              >
                {matchingIcon ? (
                  <View className="p-2 rounded-full bg-white border-2">
                    <Image
                      source={matchingIcon}
                      className="h-10 w-10 flex mb-1"
                      style={{ tintColor: "black" }}
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <Text className="text-center">No Icon</Text>
                )}

                <Text className="text-center font-bold mt-3">
                  {caffeineType.name.length > 27
                    ? `${caffeineType.name.slice(0, 27)}...`
                    : caffeineType.name}
                </Text>
                <View className="flex-row items-center">
                  <Image
                    source={bean}
                    className="h-3 w-2 mr-1"
                    style={{ tintColor: "black" }}
                    resizeMode="contain"
                  />
                  <Text className="text-center text-sm italic">
                    {caffeineType.mgPerCup}mg
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
      <CafModal
        isVisible={isCafModalVisible}
        onClose={closeCafModal}
        onConfirm={confirmCaffeine}
      >
        {selectedCaf && (
          <View>
            <Text className="text-lg font-semibold mb-3">
              {" "}
              {selectedCaf.name}{" "}
            </Text>
            <Text className="text-lg font-semibold mb-3">
              {" "}
              ({selectedCaf.mgPerCup} mg of caffeine){" "}
            </Text>
          </View>
        )}
      </CafModal>
    </View>
  );
};

export default CafMenu;
