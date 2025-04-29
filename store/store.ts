import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import data from "../src/data";

type CaffeineStore = {
  cafTypes: Object;
  setCafTypes: (newCafTypes: Object) => void;
};

export const useCaffeineStore = create<CaffeineStore>((set) => ({
  cafTypes: data.caffeineTypes,

  setCafTypes: (newCafTypes) => {
    set({ cafTypes: newCafTypes });
  },
}));

type TimelineStore = {
  cafLog: Object;
  cafTimeline: Object;
  setCafLog: (newCafTimeline: Object) => void;
  setCafTimeline: (newCafTimeline: Object) => void;
};

export const useTimelineStore = create<TimelineStore>((set) => ({
  cafLog: [],
  cafTimeline: [],

  setCafLog: (newCafLog) => {
    set({ cafLog: newCafLog });
  },
  setCafTimeline: (newCafTimeline) => {
    set({ cafTimeline: newCafTimeline });
  },
}));

// type SettingsStore = {
//   threshold: number;
//   timeZone: number;
//   maxCafLevel: number;
//   bedtime: Date;
//   setThreshold: (newThreshold: number) => void;
//   setTimeZone: (newTimeZone: number) => void;
//   setMaxCafLevel: (newMaxCafLevel: number) => void;
//   setBedtime: (newBedtime: Date) => void;
// };

export const useSettingsStore = create(
  persist(
    (set) => ({
      threshold: 100,
      timeZone: 1,
      maxCafLevel: 600,
      warnings: false,
      bedtime: new Date(new Date().setHours(23, 0, 0, 0)),
      setThreshold: (newThreshold: number) => {
        set({ threshold: newThreshold });
      },
      setTimeZone: (newTimeZone: number) => {
        set({ threshold: newTimeZone });
      },
      setMaxCafLevel: (newMaxCafLevel: number) => {
        set({ maxCafLevel: newMaxCafLevel });
      },
      setWarnings: (newWarnings: boolean) => {
        set({ warnings: newWarnings });
      },
      setBedtime: (newBedtime: Date) => {
        set({ bedtime: newBedtime });
      },
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

type TimeStore = {
  selectedTime: Date;
  setSelectedTime: (newTime: Date) => void;
};

export const useTimeStore = create<TimeStore>((set) => ({
  selectedTime: new Date(), // Default to current time
  setSelectedTime: (newTime: Date) => {
    set({ selectedTime: newTime });
  },
}));

type DrinkStore = {
  selectedDrink: Object;
  setSelectedDrink: (newSelectedDrink: Object) => void;
};

export const useDrinkStore = create<DrinkStore>((set) => ({
  selectedDrink: [],
  setSelectedDrink: (newSelectedDrink) => {
    set({ selectedDrink: newSelectedDrink });
  },
}));
