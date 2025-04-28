import React, { useState } from "react";
import { Text, View } from "react-native";
import Header from "@/components/Header";
import { Pressable } from "react-native";
import { Link } from "expo-router";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import SettingsModal from "@/components/SettingsModal";
import { useSettingsStore } from "@/store/store";

export default function Settings() {
  const {
    threshold,
    maxCafLevel,
    warnings,
    // bedtime,
    setThreshold,
    setMaxCafLevel,
    setWarnings,
    // setBedtime,
  } = useSettingsStore();

  const [settingsValues, setSettingsValues] = useState({
    warnings: warnings,
    caffeine_tolerance: threshold,
    maxcaffeinelevel: maxCafLevel,
  });
  const [openModal, setOpenModal] = useState<
    null | "caftolerance" | "maxcaflevel" | "bedtime"
  >(null);

  return (
    <View>
      <Header />

      <View className="h-full bg-white pt-2 pl-10 pr-10">
        <Text className="text-xl font-bold mb-5">Settings</Text>

        <View className="rounded-lg bg-gray-50 border border-gray-300 px-3 py-[22px] mb-2">
          <Link className="" href="/drinks" asChild>
            <Pressable className="flex-row justify-between items-center">
              <Text className="text-sm font-normal">Customize Drinks Menu</Text>
              <ChevronRightIcon color="black" fill="white" size={22} />
            </Pressable>
          </Link>
        </View>

        <View className="rounded-lg bg-gray-50 border border-gray-300 p-3 mb-2">
          <Link className="" href="/settings" asChild>
            <Pressable
              className="flex-row justify-between items-center"
              onPress={() => setOpenModal("caftolerance")}
            >
              <View>
                <Text className="text-sm font-normal">Caffeine Tolerance</Text>
                <Text className="text-sm font-normal text-blue-400">
                  {threshold}mg
                </Text>
              </View>
              <ChevronRightIcon color="black" fill="white" size={22} />
            </Pressable>
          </Link>
        </View>

        <View className="rounded-lg bg-gray-50 border border-gray-300 p-3 mb-2">
          <Link className="" href="/settings" asChild>
            <Pressable
              className="flex-row justify-between items-center"
              onPress={() => setOpenModal("maxcaflevel")}
            >
              <View>
                <Text className="text-sm font-normal">Max caffeine level</Text>
                <Text className="text-sm font-normal text-blue-400">
                  {maxCafLevel}mg | Warnings:{" "}
                  {settingsValues.warnings ? "ON" : "OFF"}
                </Text>
              </View>
              <ChevronRightIcon color="black" fill="white" size={22} />
            </Pressable>
          </Link>
        </View>

        <SettingsModal
          visible={openModal === "caftolerance"}
          title="Caffeine Tolerance"
          fields={[
            {
              name: "caffeine_tolerance",
              label: "Caffeine Tolerance (mg)",
              type: "numeric",
            },
          ]}
          values={settingsValues}
          onChange={(name, value) =>
            setSettingsValues((prev) => ({ ...prev, [name]: value }))
          }
          onSave={() => {
            setThreshold(settingsValues.caffeine_tolerance);
            setOpenModal(null);
          }}
          onCancel={() => setOpenModal(null)}
        />

        <SettingsModal
          visible={openModal === "maxcaflevel"}
          title="Max Caffeine Level"
          fields={[
            {
              name: "maxcaffeinelevel",
              label: "Max Caffeine Level (mg)",
              type: "numeric",
            },
            {
              name: "warnings",
              label: "Warnings",
              type: "switch",
            },
          ]}
          values={settingsValues}
          onChange={(name, value) =>
            setSettingsValues((prev) => ({ ...prev, [name]: value }))
          }
          onSave={() => {
            setMaxCafLevel(settingsValues.maxcaffeinelevel);
            setWarnings(settingsValues.warnings);
            setOpenModal(null);
          }}
          onCancel={() => setOpenModal(null)}
        />
      </View>
    </View>
  );
}
