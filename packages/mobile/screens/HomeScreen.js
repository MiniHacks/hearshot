import React from "react";
import { Pressable, Text, View } from "react-native";
import { globalStyles } from "../static/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#111113",
        paddingVertical: 64,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          paddingHorizontal: 16,
        }}
      >
        <Pressable
          style={{
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "white",
            padding: 8,
            borderRadius: 6,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <MaterialCommunityIcons
            name="cog-outline"
            color="#FFFFFF"
            size={28}
          />
        </Pressable>
        <Pressable
          style={{
            flexDirection: "row",
            color: "white",
          }}
        >
          <MaterialCommunityIcons
            name="home-outline"
            color="#8269E3"
            size={24}
          />
          <Text style={{ fontSize: 20, color: "white", marginHorizontal: 8 }}>
            My Location
          </Text>
        </Pressable>
        <Pressable
          style={{
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#FF2F0E",
            padding: 8,
            borderRadius: 6,
            backgroundColor: "rgba(255, 47, 14, 0.1)",
          }}
        >
          <MaterialCommunityIcons
            name="radio-tower"
            color="#FF2F0E"
            size={28}
          />
        </Pressable>
      </View>
      <Text style={globalStyles.text}>insert epic map component here</Text>
      <Text style={globalStyles.text}>5 recent alerts in this area</Text>
    </View>
  );
}
