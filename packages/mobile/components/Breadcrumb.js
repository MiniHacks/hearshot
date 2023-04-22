import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Breadcrumb({ navigation, pageName }) {
  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={() => navigation.pop()}
    >
      <MaterialCommunityIcons name="chevron-left" color="#C7C7C7" size={28} />
      <Text style={styles.title}>{pageName}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#C7C7C7",
    fontSize: 28,
    fontWeight: "bold",
  },
});
