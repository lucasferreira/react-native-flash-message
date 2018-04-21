import React from "react";
import { StyleSheet, StatusBar, TouchableOpacity, ScrollView, Text, View } from "react-native";

import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

import DemoButton from "../components/DemoButton";

const Sepator = ({ style }) => <View style={[styles.separator, style]} />;

export default class MainScreen extends React.Component {
  static navigationOptions = {
    title: "Flash Message Demo",
  };
  showSimpleMessage(type = "default", props = {}) {
    const message = {
      message: "Some message title",
      description: "Lorem ipsum dolar sit amet",
      icon: { icon: "auto", position: "left" },
      type,
      ...props,
    };

    showMessage(message);
  }
  messageWithPosition(position = "top") {
    const message = {
      message: "Some message title",
      description: "Lorem ipsum dolar sit amet",
      type: "info",
      position,
    };

    showMessage(message);
  }
  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView style={{ flex: 1 }} alwaysBounceVertical={false}>
          <View style={{ alignSelf: "center", width: "100%", padding: 23 }}>
            <View style={styles.group}>
              <DemoButton style={styles.demoButton} label="Simple Message" onPress={() => this.showSimpleMessage()} />
              <DemoButton
                style={[styles.demoButton, { backgroundColor: "#636363" }]}
                label="Single Line"
                onPress={() => showMessage({ message: "Just one single line in this", type: "info" })}
              />
              <DemoButton
                style={[styles.demoButton, { backgroundColor: "#CC00FF" }]}
                labelStyle={{ fontSize: 14 }}
                label="Hide Status (iOS)"
                onPress={() =>
                  showMessage({
                    message: "Message that hide your status bar",
                    description: "Cool, uhm?",
                    type: "success",
                    hideStatusBar: true,
                  })
                }
              />
              <DemoButton style={styles.demoButton} label="Hide Message" onPress={() => hideMessage()} />
            </View>
            <Sepator />
            <View style={styles.group}>
              <DemoButton
                style={[styles.demoButton, { backgroundColor: FlashMessage.ColorTheme.success }]}
                label="Success"
                onPress={() => this.showSimpleMessage("success")}
              />
              <DemoButton
                style={[styles.demoButton, styles.demoButtonInline, { backgroundColor: FlashMessage.ColorTheme.info }]}
                label="Info"
                onPress={() => this.showSimpleMessage("info")}
              />
              <DemoButton
                style={[styles.demoButton, { backgroundColor: FlashMessage.ColorTheme.warning }]}
                label="Warning"
                onPress={() => this.showSimpleMessage("warning")}
              />
              <DemoButton
                style={[styles.demoButton, { backgroundColor: FlashMessage.ColorTheme.danger }]}
                label="Danger"
                onPress={() => this.showSimpleMessage("danger")}
              />
              <DemoButton
                style={[styles.demoButton, styles.demoButtonInline, { backgroundColor: "pink" }]}
                label="Custom Color"
                onPress={() => this.showSimpleMessage("default", { backgroundColor: "pink" })}
              />
              <DemoButton
                style={[styles.demoButton, styles.demoButtonInline, { backgroundColor: "cyan" }]}
                label="Custom Text Color"
                onPress={() => this.showSimpleMessage("default", { backgroundColor: "cyan", color: "red" })}
              />
              <DemoButton
                style={[styles.demoButton, { backgroundColor: FlashMessage.ColorTheme.success }]}
                label="Success (Floating)"
                onPress={() => this.showSimpleMessage("success", { floating: true })}
              />
            </View>
            <Sepator />
            <View style={styles.group}>
              <DemoButton
                style={styles.demoButton}
                label="Message Bottom"
                onPress={() => this.messageWithPosition("bottom")}
              />
              <DemoButton
                style={styles.demoButton}
                label="Message Center"
                onPress={() => this.messageWithPosition("center")}
              />
              <DemoButton
                style={styles.demoButton}
                label="Message Top"
                onPress={() => this.messageWithPosition("top")}
              />
              <DemoButton
                style={styles.demoButton}
                label="Custom Message Position"
                onPress={() => this.messageWithPosition({ top: 60, left: 30, right: 30 })}
              />
            </View>
            <Sepator />
            <View style={styles.group}>
              <DemoButton
                style={styles.demoButton}
                labelStyle={{ fontSize: 14 }}
                label="Message without Anim"
                onPress={() => this.showSimpleMessage("info", { animated: false })}
              />
              <DemoButton
                style={styles.demoButton}
                label="autoHide=false"
                onPress={() =>
                  showMessage({
                    message: "This message will desapear only if you press",
                    type: "warning",
                    autoHide: false,
                  })
                }
              />
            </View>
            <Sepator />
            <View style={styles.group}>
              <DemoButton
                style={[styles.demoButton, { backgroundColor: "black" }]}
                labelStyle={{ fontSize: 14 }}
                label="Message with Custom Transition"
                onPress={() => navigation.navigate("CustomTransition")}
              />
              <DemoButton
                style={[styles.demoButton, { backgroundColor: "black" }]}
                label="Message Events"
                onPress={() => navigation.navigate("Events")}
              />
              <DemoButton
                style={[styles.demoButton, { backgroundColor: "black" }]}
                label="Message from Modal"
                onPress={() => navigation.navigate("DemoModal")}
              />
              <DemoButton
                style={[styles.demoButton, { backgroundColor: "black" }]}
                label="Message Local Instance"
                onPress={() => navigation.navigate("LocalInstance")}
              />
            </View>
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
  },
  demoButton: {
    alignSelf: "auto",
    marginBottom: 9,
    marginHorizontal: 5,
  },
});
