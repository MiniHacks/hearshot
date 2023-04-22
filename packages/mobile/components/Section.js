import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "../static/styles";

export default function Section({ title, subtitle, iconName, link }) {
  return (
    <View
      style={{
        display: "flex",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 16,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <MaterialCommunityIcons name={iconName} color="#C7C7C7" size={28} />
        <View style={{ flexDirection: "column", marginHorizontal: 16 }}>
          <Text
            style={{
              color: "white",
              fontSize: 24,
              marginBottom: 8,
              fontWeight: "600",
            }}
          >
            {title}
          </Text>
          <Text style={{ color: "#C7C7C7", fontSize: 18 }}>{subtitle}</Text>
        </View>
      </View>
      <MaterialCommunityIcons
        name={"chevron-right"}
        color={"#C7C7C7"}
        size={28}
      />
    </View>
  );
}
