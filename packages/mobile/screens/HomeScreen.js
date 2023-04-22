import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ButtonTransparent from "../components/ButtonTransparent";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  // TODO: lol redundant styling
  // TODO: move to styles.js
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
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
        <ButtonTransparent
          hexBorder={"#FFFFFF"}
          rgbFill={"rgba(255, 255, 255, 0.1)"}
          iconName={"cog-outline"}
        />
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
        <ButtonTransparent
          hexBorder={"#FF2F0E"}
          rgbFill={"rgba(255, 47, 14, 0.1)"}
          iconName={"radio-tower"}
        />
      </View>
      <Text style={styles.text}>insert epic map component here</Text>
      <Text style={styles.text}>5 recent alerts in this area</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#C7C7C7",
    marginVertical: 8,
    fontSize: 16,
  },
});
