import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111113",
  },
  text: {
    color: "#C7C7C7",
    marginVertical: 8,
    fontSize: 16,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    width: 320,
    height: 48,
    backgroundColor: "#2C2C2E",
    borderStyle: "solid",
    borderColor: "#909090",
    borderWidth: 1,
    borderRadius: 6,
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
