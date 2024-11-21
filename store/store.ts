import { create } from 'zustand'
import data from "../src/data";



type CaffeineStore = {
    cafTypes: Object;
    setCafTypes: (newCafTypes: Object) => void;
}

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
}

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


type SettingsStore = {
    threshold: number;
    timeZone: number;
    setThreshold: (newThreshold: number) => void;
    setTimeZone: (newTimeZone: number) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    threshold: 100,
    timeZone:1,
    setThreshold: (newThreshold: number) => {
        set({ threshold: newThreshold });
    },
    setTimeZone: (newTimeZone: number) => {
        set({ threshold: newTimeZone });
    },
}));