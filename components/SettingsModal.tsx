import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
} from "react-native";

type Field = {
  name: string;
  label: string;
  type: "text" | "switch" | "numeric";
};

type SettingsModalProps = {
  visible: boolean;
  title: string;
  fields: Field[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
};

const SettingsModal = ({
  visible,
  title,
  fields,
  values,
  onChange,
  onSave,
  onCancel,
}: SettingsModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white p-5 rounded-lg w-4/5">
          <Text className="text-xl font-bold mb-5">{title}</Text>

          {fields.map((field) => {
            const renderInput = () => {
              if (field.type === "text" || field.type === "numeric") {
                return (
                  <TextInput
                    value={String(values[field.name])}
                    onChangeText={(text) => {
                      const newValue =
                        field.type === "numeric" ? Number(text) : text;
                      onChange(field.name, newValue);
                    }}
                    className="border border-gray-300 p-2 rounded"
                    keyboardType={
                      field.type === "numeric" ? "numeric" : "default"
                    }
                  />
                );
              }

              if (field.type === "switch") {
                return (
                  <Switch
                    value={values[field.name]}
                    onValueChange={(value) => onChange(field.name, value)}
                  />
                );
              }

              return null;
            };

            return (
              <View key={field.name} className="mb-4">
                <Text className="mb-1">{field.label}</Text>
                {renderInput()}
              </View>
            );
          })}

          <View className="flex-row justify-between mt-5">
            <TouchableOpacity
              onPress={onCancel}
              className="p-2 bg-purple-600 rounded-lg flex-1 mr-2"
            >
              <Text className="text-center text-white font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSave}
              className="p-2 bg-blue-600 rounded-lg flex-1 ml-2"
            >
              <Text className="text-center text-white font-semibold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SettingsModal;
