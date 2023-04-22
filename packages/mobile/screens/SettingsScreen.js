import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../static/styles";
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
    justifyContent: "flex-start",
    paddingVertical: 64,
    paddingHorizontal: 16,
  };

  return (
    <View style={containerStyle}>
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
    </View>
  );
}
