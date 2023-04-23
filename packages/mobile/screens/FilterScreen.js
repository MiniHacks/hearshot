import { Pressable, StyleSheet, Text, View } from "react-native";
import Breadcrumb from "../components/Breadcrumb";
import Input from "../components/Input";
import { useState } from "react";
import Tag from "../components/Tag";

export default function FilterScreen({ navigation }) {
  const [radius, setRadius] = useState("");
  const [filters, setFilters] = useState([]);

  return (
    <View style={styles.container}>
      <Breadcrumb navigation={navigation} pageName={"Filters"} />
      <Text style={styles.title}>Settings</Text>
      <Input
        caption={"Enter Radius"}
        onChange={(number) => setRadius(number)}
        contentType={"none"}
        keyboardType={"numeric"}
        placeholder={"10"}
        state={radius}
      />
      <Text style={styles.title}>Filters</Text>
      <Input
        caption={"Add filtered words"}
        contentType={"telephoneNumber"}
        keyboardType={"default"}
        placeholder={"Shooting"}
        state={filters}
        enablesReturnKeyAutomatically={true}
        blurOnSubmit={true}
        onSubmitEditing={(filter) => {
          setFilters([...filters, filter]);
        }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          marginVertical: 16,
          flexWrap: "wrap",
        }}
      >
        {filters.map((filter) => (
          <Tag filter={filter} />
        ))}
      </View>
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
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
});
