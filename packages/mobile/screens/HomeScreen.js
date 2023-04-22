import React, { useEffect } from "react";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import ButtonTransparent from "../components/ButtonTransparent";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import notifee from "@notifee/react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import mapStyles from "../static/mapstyles.json";

export default function HomeScreen({ navigation }) {
  useEffect(() => {
    Keyboard.dismiss();
  }, [navigation]);

  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });

    // Display a notification
    await notifee.displayNotification({
      title: "Notification Title",
      body: "Main body content of the notification",
      android: {
        channelId,
        smallIcon: "name-of-a-small-icon", // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: "default",
        },
      },
    });
  }

  // TODO: lol redundant styling
  // TODO: move to styles.js
  return (
    <View
      style={{
        height: "100%",
      }}
    >
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: -1,
        }}
        customMapStyle={mapStyles}
        userInterfaceStyle={"dark"}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      <SafeAreaView
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          paddingHorizontal: 16,
          // top: 0,
          // zIndex: 1,
        }}
      >
        <ButtonTransparent
          hexBorder={"#FFFFFF"}
          rgbFill={"rgba(255, 255, 255, 0.1)"}
          iconName={"cog-outline"}
          onPress={() => navigation.navigate("Settings")}
        />
        <Pressable
          style={{
            flexDirection: "row",
            color: "white",
          }}
        >
          <MaterialCommunityIcons
            name="home-outline"
            color="#8269E3"
            size={24}
          />
          <Text style={{ fontSize: 20, color: "white", marginHorizontal: 8 }}>
            My Location
          </Text>
        </Pressable>
        <ButtonTransparent
          hexBorder={"#FF2F0E"}
          rgbFill={"rgba(255, 47, 14, 0.1)"}
          iconName={"radio-tower"}
          onPress={onDisplayNotification}
        />
      </SafeAreaView>

      <SafeAreaView
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={styles.text}>5 recent alerts in this area</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#C7C7C7",
    marginVertical: 8,
    fontSize: 16,
  },
});
