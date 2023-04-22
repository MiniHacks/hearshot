import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Notification from "../components/Notification";

const notifications = [
  {
    title: "Past Notifications",
    subtitle: "See previous messages",
    iconName: "bell-badge-outline",
  },
  {
    title: "Filters",
    subtitle: "Get fewer notifications",
    iconName: "filter-outline",
  },
];
export default function NotificationScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Pressable
        style={{ flexDirection: "row" }}
        onPress={() => navigation.pop()}
      >
        <MaterialCommunityIcons name="chevron-left" color="#C7C7C7" size={28} />
        <Text style={styles.title}>Notifications</Text>
      </Pressable>

      {notifications.map((section, index) => (
        <View key={notifications.title}>
          <Notification />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    paddingVertical: 64,
    paddingHorizontal: 16,
    backgroundColor: "#1C1C1E",
  },

  title: {
    color: "#C7C7C7",
    fontSize: 24,
  },

  hr: {
    borderBottomColor: "#252525",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});
