import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

const DemoButton = ({ style, labelStyle, label, onPress }) => (
  <TouchableOpacity activeOpacity={0.75} style={[styles.button, style]} onPress={onPress}>
    <Text style={[styles.buttonLabel, labelStyle]}>{label}</Text>
  </TouchableOpacity>
);

export default DemoButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    backgroundColor: "#999",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    overflow: "hidden",
  },
  buttonLabel: {
    fontSize: 16,
    letterSpacing: -0.3,
    lineHeight: 19,
    textAlign: "center",
    color: "#fff",
  },
});
