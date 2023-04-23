import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Button,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ButtonTransparent from "../components/ButtonTransparent";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import notifee from "@notifee/react-native";
import * as Location from "expo-location";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Map from "../components/Map";
import BottomSheet from "@gorhom/bottom-sheet";
import Notification from "../components/Notification";

export default function HomeScreen({ navigation }) {
  useEffect(() => {
    Keyboard.dismiss();
  }, [navigation]);

  // ref
  const bottomSheetRef = useRef(null);

  const [activeAlert, setActiveAlert] = useState(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "80%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  const mapRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log("Location", location);
    })();
  }, []);

  const insets = useSafeAreaInsets();

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

  const snapTo = useCallback((index) => {
    bottomSheetRef.current.snapToIndex(index);
  }, []);

  // TODO: lol redundant styling
  // TODO: move to styles.js
  return (
    <View
      style={{
        height: "100%",
      }}
    >
      <Map ref={mapRef} snapTo={snapTo} setActiveAlert={setActiveAlert} />
      <LinearGradient
        // Top Linear Gradient
        colors={[
          "rgba(0,0,0,1)",
          "rgba(0,0,0,.8438)",
          "rgba(0,0,0,.3438)",
          "rgba(0,0,0,.17)",
          "rgba(0,0,0,0)",
        ]}
        locations={[0, 0.3, 0.7, 0.8, 1]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: insets.top + 100,
        }}
        pointerEvents={"none"}
      />
      <LinearGradient
        // Top Linear Gradient
        colors={["rgba(0,0,0,.95)", "rgba(0,0,0,.7438)", "rgba(0,0,0,0)"]}
        locations={[1, 0.5, 0]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: insets.bottom + 70,
        }}
        pointerEvents={"none"}
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
          onPress={() =>
            navigation.navigate("Settings", { location: location })
          }
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
        pointerEvents={"none"}
      >
        <Text style={styles.text}>5 recent alerts in this area</Text>
      </SafeAreaView>
      <BottomSheet
        backgroundStyle={styles.sheet}
        handleIndicatorStyle={styles.handle}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
      >
        {activeAlert != null && (
          <View style={styles.content}>
            <Notification
              tagline={activeAlert.name}
              location={activeAlert.address}
              notifLocation={activeAlert.coord}
              notifTime={new Date(activeAlert.date)}
              distance={activeAlert.distance}
            />

            {/*<Text style={styles.text}>{JSON.stringify(activeAlert)}</Text>*/}
            <Button
              color={"#898686"}
              title={"Close"}
              onPress={() => {
                bottomSheetRef.current.close();
                setActiveAlert(null);
              }}
            />
          </View>
        )}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#C7C7C7",
    marginVertical: 8,
    fontSize: 16,
  },
  sheet: {
    backgroundColor: "#151515FF",
  },
  handle: {
    width: "40%",
    backgroundColor: "#2E2D2DFF",
  },
  content: {
    paddingHorizontal: 24,
  },
});
