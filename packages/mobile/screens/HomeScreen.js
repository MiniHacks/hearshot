import React, { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, View } from "react-native";
import notifee from "@notifee/react-native";
import Map from "../components/Map";
import TopLinearGradient from "../components/TopLinearGradient";
import BottomDrawer from "../components/BottomDrawer";
<<<<<<< HEAD
import NumberOfAlerts from "../components/NumberOfAlerts";
import { NavBar } from "../components/NavBar";
=======
import { getDistance } from "./NotificationScreen";
>>>>>>> f080485bc50fc8ff24005e262f5b5b2e151c309d

export default function HomeScreen({ navigation }) {
  useEffect(() => {
    Keyboard.dismiss();
  }, [navigation]);

  // ref
  const bottomSheetRef = useRef(null);

  const [activeAlert, setActiveAlert] = useState(null);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  const mapRef = useRef(null);

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
      <TopLinearGradient />
      <NavBar navigation={navigation} onLiveClick={onDisplayNotification} />
      <NumberOfAlerts />
      <BottomDrawer
        ref={bottomSheetRef}
        alert={activeAlert}
        setAlert={setActiveAlert}
        handleSheetChanges={handleSheetChanges}
      >
        {activeAlert != null && (
          <View style={styles.content}>
            <Notification
              tagline={activeAlert.name}
              location={activeAlert.address}
              notifLocation={activeAlert.coord}
              notifTime={new Date(activeAlert.date)}
              distance={getDistance(activeAlert.coord)}
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
      </BottomDrawer>
    </View>
  );
}
