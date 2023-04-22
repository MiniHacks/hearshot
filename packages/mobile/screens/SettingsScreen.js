import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Section from "../components/Section";

const generalSections = [
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

const supportSections = [
  {
    title: "Github",
    subtitle: "View our code",
    iconName: "github",
    link: "https://github.com/MiniHacks/hearshot",
  },
  {
    title: "Devpost",
    subtitle: "Leave a like!",
    iconName: "routes",
    link: "https://devpost.com/software/hearshot",
  },
  {
    title: "Feedback",
    subtitle: "Drop us a line",
    iconName: "comment-quote-outline",
    link: "https://google.com",
  },
];

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Pressable
        style={{ flexDirection: "row" }}
        onPress={() => navigation.pop()}
      >
        <MaterialCommunityIcons name="chevron-left" color="#C7C7C7" size={28} />
        <Text style={styles.title}>Settings</Text>
      </Pressable>

      <Text style={styles.heading}>General</Text>
      {generalSections.map((section, index) => (
        <>
          <Section
            key={section.title}
            title={section.title}
            subtitle={section.subtitle}
            iconName={section.iconName}
          />
          {index !== generalSections.length - 1 && (
            <View style={styles.hr}></View>
          )}
        </>
      ))}
      <Text style={styles.heading}>Support us</Text>
      {supportSections.map((section, index) => (
        <View key={section.title}>
          <Section
            key={section.title}
            title={section.title}
            subtitle={section.subtitle}
            iconName={section.iconName}
            link={section.link}
          />
          {index !== supportSections.length - 1 && (
            <View style={styles.hr}></View>
          )}
        </View>
      ))}
      <Pressable
        style={styles.button}
        title="Enter"
        accessibilityLabel="Enter a phone number"
        onPress={() => {
          navigation.navigate("Splash");
        }}
      >
        <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
          Logout
        </Text>
      </Pressable>
      <Text
        style={{ color: "#C7C7C7", alignSelf: "center", textAlign: "center" }}
      >
        Developed by Samyok, Sasha, Minnerva, and Ritik for LAHacks 2023
      </Text>
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

  heading: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 20,
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

  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 16,
    width: 320,
    height: 48,

    backgroundColor: "#FF5F3E",
    borderRadius: 40,
  },
});
