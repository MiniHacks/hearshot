import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default function Tag({ filter }) {
  return (
    <View>
      <View style={styles.container}>
        <Text>{filter}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#8269E3",
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
