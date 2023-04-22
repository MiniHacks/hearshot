import React from "react";
import { Pressable, Touchable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ButtonTransparent({
  hexBorder,
  rgbFill,
  iconName,
  ...props
}) {
  return (
    <Pressable
      style={{
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: hexBorder,
        padding: 8,
        borderRadius: 6,
        backgroundColor: rgbFill,
      }}
      {...props}
    >
      <MaterialCommunityIcons name={iconName} color={hexBorder} size={28} />
    </Pressable>
  );
}
