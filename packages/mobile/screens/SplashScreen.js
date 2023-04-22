import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  Image,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import Logo from "../assets/logo-full.png";
import SplashBackground from "../assets/splash-bkg.png";
import Collapsible from "react-native-collapsible";

const logoHeight = 150;
const logoWidth = 1.76623377 * logoHeight;
export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // TODO: this is just a delay to show the splash screen loading, lol
    //       replace with actual check to see if things are loaded
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    // TODO: probably add a transition here
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ImageBackground
        source={SplashBackground}
        resizeMode="cover"
        style={styles.center}
      >
        <Image
          style={{
            marginTop: 30,
            marginBottom: 40,
            height: logoHeight,
            width: logoWidth,
          }}
          source={Logo}
        ></Image>

        <Collapsible collapsed={isLoading} duration={750}>
          <View style={{ display: "flex", justifyContent: "flex-start" }}>
            <Text style={styles.text}>Enter phone number</Text>
            <TextInput
              style={styles.input}
              textContentType={"telephoneNumber"}
              placeholder={"(763) 333 5096"}
              keyboardType="numeric"
            />
          </View>
          <Pressable
            style={styles.button}
            title="Enter"
            accessibilityLabel="Enter a phone number"
            onPress={() => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
              }, 2000);
            }}
          >
            <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
              Enter
            </Text>
          </Pressable>
        </Collapsible>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#C7C7C7",
    marginVertical: 8,
    fontSize: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    width: 320,
    height: 48,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderStyle: "solid",
    borderColor: "#909090",
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: "#2C2C2E",
    color: "#C7C7C7",
    fontSize: 24,
  },

  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 24,
    width: 320,
    height: 48,

    backgroundColor: "#FF5F3E",
    borderRadius: 40,
  },
});
