import React from "react";
import { Modal, View, Text, TextInput, Button, Switch } from "react-native";

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
      <View
        style={{
          flex: 1,
          backgroundColor: "#00000088",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            width: "80%",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
            {title}
          </Text>

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
                    style={{ borderWidth: 1, padding: 8, borderRadius: 5 }}
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
              <View key={field.name} style={{ marginBottom: 15 }}>
                <Text style={{ marginBottom: 5 }}>{field.label}</Text>
                {renderInput()}
              </View>
            );
          })}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Button title="Cancel" onPress={onCancel} />
            <Button title="Save" onPress={onSave} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SettingsModal;
