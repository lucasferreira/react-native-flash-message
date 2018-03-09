import React from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";

import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

import DemoButton from "../components/DemoButton";

export default class LocalInstanceScreen extends React.Component {
  static navigationOptions = {
    title: "Local Instance",
  };
  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView style={{ flex: 1 }} alwaysBounceVertical={false}>
          <View style={{ alignSelf: "center", width: "100%", padding: 23 }}>
            <View style={styles.group}>
              <DemoButton
                style={styles.demoButton}
                label="Show Message"
                onPress={() => {
                  // here we are using the `showMessage` method for a local (and second) instance of Flash Message Component
                  this.refs.fmLocalInstance.showMessage({
                    message: "This message",
                    description: "Exists in a second instace of FlashMessage",
                    type: "info",
                  });
                }}
              />
              <DemoButton
                style={styles.demoButton}
                label="Hide Message"
                onPress={() => {
                  // here we are using the `hideMessage` method for a local (and second) instance of Flash Message Component
                  this.refs.fmLocalInstance.hideMessage();
                }}
              />
            </View>
          </View>
        </ScrollView>
        <FlashMessage ref="fmLocalInstance" position="bottom" animated={true} autoHide={false} />
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
    alignSelf: "auto",
    marginBottom: 9,
    marginHorizontal: 5,
  },
});
