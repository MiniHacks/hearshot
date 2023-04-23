import React from "react";
import { View, Text } from "react-native";

const TranscriptionItem = ({ item }) => {
  return (
    <View>
      <Text>{item.content}</Text>
    </View>
  );
};

const Transcription = ({ transcript }) => {
  const { name, sections, done } = transcript;

  return (
    <View>
      <Text>{name}</Text>
      <Text>{done}</Text>
      {sections.map((section) => (
        <TranscriptionItem item={section} key={section.id + section.content} />
      ))}
    </View>
  );
};

export default Transcription;
