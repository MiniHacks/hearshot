import { SafeAreaView } from "react-native-safe-area-context";
import ButtonTransparent from "./ButtonTransparent";
import { Pressable, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

export const NavBar = ({ navigation, onLiveClick }) => {
  return (
    <SafeAreaView
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 16,
        // top: 0,
        // zIndex: 1,
      }}
    >
      <ButtonTransparent
        hexBorder={"#FFFFFF"}
        rgbFill={"rgba(255, 255, 255, 0.1)"}
        iconName={"cog-outline"}
        onPress={() => navigation.navigate("Settings")}
      />
      <Pressable
        style={{
          flexDirection: "row",
          color: "white",
        }}
      >
        <MaterialCommunityIcons name="home-outline" color="#8269E3" size={24} />
        <Text style={{ fontSize: 20, color: "white", marginHorizontal: 8 }}>
          My Location
        </Text>
      </Pressable>
      <ButtonTransparent
        hexBorder={"#FF2F0E"}
        rgbFill={"rgba(255, 47, 14, 0.1)"}
        iconName={"radio-tower"}
        onPress={onLiveClick}
      />
    </SafeAreaView>
  );
};
