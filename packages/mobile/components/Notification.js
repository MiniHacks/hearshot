import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";

// FIXME: should probably just do distance calculation in screen instead?
export default function Notification({
  title,
  subtitle,
  iconName,
  coords,
  selfCoords,
}) {
  const distance = 850;
  const minAgo = 5;
  const MAX_RECENCY = 10;
  return (
    <TouchableOpacity style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          textAlignVertical: "center",
        }}
      >
        <Text style={styles.detail}>10 min ago · 4:30 PM </Text>
        {minAgo < MAX_RECENCY && (
          <MaterialCommunityIcons
            name="cast-audio-variant"
            color="#FF5F3E"
            size={18}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 8,
        }}
      >
        <Text style={styles.title}>{title}</Text>
        <Pressable
          style={styles.button}
          accessibilityLabel="Distance from event"
        >
          <Text style={{ fontSize: 14, color: "#1C1C1E", fontWeight: "bold" }}>
            {distance} ft
          </Text>
        </Pressable>
      </View>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  detail: {
    flexDirection: "row",
    color: "#C7C7C7",
    fontSize: 12,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    // marginTop: 4,
    // marginBottom: 8,
  },
  subtitle: {
    color: "#C7C7C7",
    fontSize: 16,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    height: "fit",

    backgroundColor: "#FF5F3E",
    borderRadius: 40,
  },
});
