import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Notification({
  tagline,
  location,
  distance,
  notifTime,
}) {
  // FIXME: should probably just do calculation in screen instead?
  const currentTime = new Date();
  const MAX_RECENCY = 15;
  const minDiff = () => {
    const diff = Math.abs(currentTime.getTime() - notifTime.getTime());
    return Math.floor(diff / (1000 * 60));
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          textAlignVertical: "center",
        }}
      >
        <Text style={styles.detail}>
          {minDiff()} min ago · {currentTime.toLocaleTimeString()}{" "}
        </Text>
        {minDiff() < MAX_RECENCY && (
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
        <Text style={styles.title}>{tagline}</Text>
        <Pressable
          style={styles.button}
          accessibilityLabel="Distance from event"
        >
          <Text style={{ fontSize: 14, color: "#1C1C1E", fontWeight: "bold" }}>
            {distance?.toFixed(1)} mi
          </Text>
        </Pressable>
      </View>
      <Text style={styles.subtitle}>{location}</Text>
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

    backgroundColor: "#FF5F3E",
    borderRadius: 40,
  },
});
