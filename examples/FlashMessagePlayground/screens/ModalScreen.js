import React from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";

import { showMessage, hideMessage } from "react-native-flash-message";

import DemoButton from "../components/DemoButton";

export default class ModalScreen extends React.Component {
  static navigationOptions = {
    title: "Local Instance",
  };
  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: "#393939" }}>
        <Text style={styles.text}>Demo Modal</Text>
        <ScrollView style={{ flex: 1 }} alwaysBounceVertical={false}>
          <View style={{ alignSelf: "center", width: "100%", padding: 23 }}>
            <View style={styles.group}>
              <DemoButton
                style={styles.demoButton}
                labelStyle={{ color: "#666" }}
                label="Show Message"
                onPress={() => {
                  showMessage({
                    message: "This message",
                    description: "In a modal",
                    type: "info",
                  });
                }}
              />
              <DemoButton
                style={styles.demoButton}
                labelStyle={{ color: "#999" }}
                label="Hide Message"
                onPress={() => {
                  hideMessage();
                }}
              />
            </View>
            <DemoButton
              style={styles.demoButton}
              labelStyle={{ color: "#C00", fontSize: 16 }}
              label="Close this Modal"
              onPress={() => {
                this.props.navigation.goBack(null);
              }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    backgroundColor: "#dcdcdc",
    marginTop: 2,
    marginBottom: 13,
    width: "100%",
    height: 1,
  },
  group: {
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  demoButton: {
    backgroundColor: "white",
    alignSelf: "auto",
    marginBottom: 9,
    marginHorizontal: 5,
  },
  text: {
    fontSize: 21,
    letterSpacing: -0.5,
    fontWeight: "600",
    marginVertical: 42,
    color: "white",
    textAlign: "center",
  },
});
