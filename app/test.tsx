import React, { useRef, useEffect } from "react";
import { ScrollView, View, Text, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const originalData = [
  { id: 1, text: "Part 1", color: "bg-red-500" },
  { id: 2, text: "Part 2", color: "bg-orange-500" },
  { id: 3, text: "Part 3", color: "bg-yellow-500" },
  { id: 4, text: "Part 4", color: "bg-green-500" },
  { id: 5, text: "Part 5", color: "bg-blue-500" },
  { id: 6, text: "Part 6", color: "bg-purple-500" },
];

export default function InfiniteScroll() {
  const scrollRef = useRef(null);
  const copies = 5;
  const loopedData = Array(copies).fill(originalData).flat();
  const xStart = 200 + (originalData.length - 2) * 136;
  const xBegin = 130 + (originalData.length - 1) * 136;
  const xEnd = 128 + (originalData.length - 3) * 136;

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
    <View className="p-10">
      <ScrollView
        ref={scrollRef}
        horizontal
        contentOffset={{ x: xStart, y: 0 }}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
      >
        {loopedData.map((item, index) => (
          <View
            key={index}
            className={`mt-[200px] ml-2 mr-2 h-[160px] w-[120px] flex items-center justify-center ${item.color}`}
          >
            {/* <Text className="text-white text-lg">{item.text}</Text>
            <Text className="text-white text-lg">{index}</Text>
            <Text className="text-white text-lg">+</Text> */}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
