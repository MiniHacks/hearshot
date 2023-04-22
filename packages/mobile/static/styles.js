import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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

  heading: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 20,
  },

  title: {
    color: "#C7C7C7",
    fontSize: 24,
  },

  hr: {
    borderBottomColor: "#252525",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});
