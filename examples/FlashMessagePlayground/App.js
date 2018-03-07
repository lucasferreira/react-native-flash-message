import React from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import FlashMessage, { showMessage, hideMessage } from "../../src";

const DemoButton = ({ style, label, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.75}
    style={[styles.button, style]}
    onPress={onPress}>
    <Text style={styles.buttonLabel}>{label}</Text>
  </TouchableOpacity>
);

export default class App extends React.Component {
  showSimpleMessage() {
    const message = {
      message: "Some message title",
      description: "Lorem ipsum dolar sit amet",
      type: "success",
    };

    showMessage(message);
  }
  showSecondMessageComponent() {
    const message = {
      message: "Some simple message to show",
      type: "warning",
    };

    this.refs.masterMessageBottom.showMessage(message);
  }
  hideMessage() {
    hideMessage();
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Text style={styles.title}>Demo</Text>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
          alwaysBounceVertical={false}>
          <View style={{ width: 290 }}>
            <DemoButton
              style={styles.demoButton}
              label="Second Message Component"
              onPress={() => this.showSecondMessageComponent()}
            />
            <DemoButton
              style={styles.demoButton}
              label="Simple Message"
              onPress={() => this.showSimpleMessage()}
            />
            <DemoButton
              style={styles.demoButton}
              label="Hide Message"
              onPress={() => this.hideMessage()}
            />
          </View>
        </ScrollView>
        <FlashMessage ref="masterMessage" position="top" animated={true} />
        <FlashMessage
          ref="masterMessageBottom"
          position="bottom"
          animated={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  title: {
    alignSelf: "stretch",
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: -0.5,
    textAlign: "center",
    marginVertical: 36,
  },
  button: {
    alignSelf: "stretch",
    backgroundColor: "#cdcdcd",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 7,
    overflow: "hidden",
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#fff",
  },
  demoButton: {
    marginBottom: 12,
  },
});
