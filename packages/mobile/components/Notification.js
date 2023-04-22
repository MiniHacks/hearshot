import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Section(title, subtitle, iconName) {
  return (
    <TouchableOpacity>
      <View>
        <Text>10 min ago</Text>
        <MaterialCommunityIcons name={iconName} color="#C7C7C7" size={28} />
      </View>
      <View>
        <Text>Reported gunshots</Text>
        <Text>850 ft away button</Text>
      </View>
      <Text>Location</Text>
    </TouchableOpacity>
  );
}
