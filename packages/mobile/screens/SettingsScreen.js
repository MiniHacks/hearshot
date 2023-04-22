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
  },
  {
    title: "Feedback",
    subtitle: "Drop us a line",
    iconName: "comment-quote-outline",
  },
];

export default function SettingsScreen() {
  const containerStyle = {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    paddingVertical: 64,
    paddingHorizontal: 16,
    backgroundColor: "#1C1C1E",
  };

  return (
    <View style={containerStyle}>
      <View style={{ flexDirection: "row" }}>
        <MaterialCommunityIcons name="chevron-left" color="#C7C7C7" size={28} />
        <Text style={styles.title}>Settings</Text>
      </View>

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
        <>
          <Section
            key={section.title}
            title={section.title}
            subtitle={section.subtitle}
            iconName={section.iconName}
          />
          {index !== supportSections.length - 1 && (
            <View style={styles.hr}></View>
          )}
        </>
      ))}
      <Text
        style={{ color: "#C7C7C7", alignSelf: "center", textAlign: "center" }}
      >
        Developed by Samyok, Sasha, Mini, and Ritik for LAHacks 2023
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
