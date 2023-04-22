import React from "react";
import {
  ImageBackground,
  Image,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import { globalStyles } from "../static/styles";
import Logo from "../static/images/logo.png";
import SplashBackground from "../static/images/splash.png";

export default function SplashScreen() {
  return (
    <KeyboardAvoidingView style={globalStyles.container}>
      <ImageBackground
        source={SplashBackground}
        resizeMode="cover"
        style={globalStyles.image}
      >
        <Image
          style={{ marginTop: 30, marginBottom: 60 }}
          source={Logo}
        ></Image>

        <View style={{ display: "flex", justifyContent: "flex-start" }}>
          <Text style={globalStyles.text}>Enter phone number</Text>
          <TextInput
            style={globalStyles.input}
            textContentType={"telephoneNumber"}
            placeholder={"(763) 333 5096"}
            keyboardType="numeric"
          />
        </View>

        <Pressable
          style={globalStyles.button}
          title="Enter"
          accessibilityLabel="Enter a phone number"
        >
          <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
            Enter
          </Text>
        </Pressable>
      </ImageBackground>
      {/*<Text style={globalStyles.text}>lol this is some text</Text>*/}
    </KeyboardAvoidingView>
  );
}
