import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Notification from "../components/Notification";
import Navigator from "../components/Navigator";

// TODO: dummy data stuff; replace when we actually get data.
function generateRandomDate() {
  const now = new Date();
  const randomOffset = Math.floor(Math.random() * 61) - 30;
  return new Date(now.getTime() + randomOffset * 60 * 1000);
}

function generateRandomDistance() {
  return Math.floor(Math.random() * 100);
}

const notifications = [
  {
    tagline: "Reported Gunshots",
    location: "Middlebrook Hall",
    notifTime: generateRandomDate(),
    distance: generateRandomDistance(),
  },
  {
    tagline: "Fire on 2nd Floor",
    location: "Keller Hall",
    notifTime: generateRandomDate(),
    distance: generateRandomDistance(),
  },
  {
    tagline: "Indecent Conduct",
    location: "Pioneer Hall",
    notifTime: generateRandomDate(),
    distance: generateRandomDistance(),
  },
  {
    tagline: "Attempted Carjacking",
    location: "600 11th Ave SE",
    notifTime: generateRandomDate(),
    distance: generateRandomDistance(),
  },
];

// TODO: im assuming we're converting lat/long to distance here
//       and get the location string (ex: "keller hall") from it here too???

export default function NotificationScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Navigator navigation={navigation} pageName={"Notifications"} />

      {notifications
        .slice()
        .sort((a, b) => a.distance - b.distance)
        .map((notif, index) => (
          <View key={notif.tagline}>
            <Notification
              tagline={notif.tagline}
              location={notif.location}
              notifTime={notif.notifTime}
              distance={notif.distance}
            />
            {index !== notifications.length - 1 && (
              <View style={styles.hr}></View>
            )}
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
