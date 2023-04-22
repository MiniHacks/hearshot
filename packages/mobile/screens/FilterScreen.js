import { Pressable, StyleSheet, Text, View } from "react-native";
import Breadcrumb from "../components/Breadcrumb";

export default function FilterScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Breadcrumb navigation={navigation} pageName={"Filters"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    paddingVertical: 64,
    paddingHorizontal: 16,
    backgroundColor: "#1C1C1E",
  },
});
