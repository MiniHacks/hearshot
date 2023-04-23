import BottomSheet from "@gorhom/bottom-sheet";
import { Button, StyleSheet, View } from "react-native";
import Notification from "./Notification";
import { forwardRef, useMemo } from "react";

const BottomDrawer = forwardRef(
  ({ alert, setAlert, handleSheetChanges }, ref) => {
    // variables
    const snapPoints = useMemo(() => ["25%", "80%"], []);

    return (
      <BottomSheet
        backgroundStyle={styles.sheet}
        handleIndicatorStyle={styles.handle}
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
      >
        {alert != null && (
          <View style={styles.content}>
            <Notification
              tagline={alert.name}
              location={alert.address}
              notifLocation={alert.coord}
              notifTime={new Date(alert.date)}
              distance={alert.distance}
            />

            {/*<Text style={styles.text}>{JSON.stringify(alert)}</Text>*/}
            <Button
              color={"#898686"}
              title={"Close"}
              onPress={() => {
                ref.current.close();
                setAlert(null);
              }}
            />
          </View>
        )}
      </BottomSheet>
    );
  }
);

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

export default BottomDrawer;
