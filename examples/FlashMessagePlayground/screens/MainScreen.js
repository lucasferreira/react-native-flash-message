import React from "react";
import { StyleSheet, StatusBar, TouchableOpacity, ScrollView, Image, Text, View } from "react-native";

import FlashMessage, { FlashMessageManager, showMessage, hideMessage } from "react-native-flash-message";

import DemoButton from "../components/DemoButton";
import CustomModal from "../components/CustomModal";

const Sepator = ({ style }) => <View style={[styles.separator, style]} />;

export default class MainScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      customModalVisible: false,
    };
  }
  showSimpleMessage(type = "default", props = {}) {
    const message = {
      message: "Some message title",
      description: "Lorem ipsum dolar sit amet. Lorem ipsum dolar sit amet and this is it a long text to test.",
      icon: { icon: "auto", position: "left" },
      type,
      ...props,
    };

    showMessage(message);
  }
  showCustomIconMessage() {
    const message = {
      message: "Some message title",
      description: "Lorem ipsum dolar sit amet. Lorem ipsum dolar sit amet and this is it a long text to test.",
      backgroundColor: FlashMessage.ColorTheme.success,
      icon: ({ style, ...props }) => (
        <Image source={require("../assets/favicon.png")} style={[style, { width: 32, height: 32 }]} {...props} />
      ),
    };

    showMessage(message);
  }
  messageWithPosition(position = "top", hasDescription = true, extra = {}) {
    let message = {
      message: "Some short message title",
      type: "info",
      position,
      ...extra,
    };

    if (hasDescription) {
      message = { ...message, description: "Lorem ipsum dolar sit amet" };
    } else {
      message = { ...message, floating: true };
    }

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
                style={[styles.demoButton, { backgroundColor: "black" }]}
                label="Custom Icon"
                onPress={() => this.showCustomIconMessage()}
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
                label="Message Bottom (Floating)"
                onPress={() => this.messageWithPosition("bottom", false)}
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
                label="Message Custom Content"
                onPress={() =>
                  this.showSimpleMessage("info", {
                    renderCustomContent: () => (
                      <View style={{ padding: 9 }}>
                        <Text>What?</Text>
                      </View>
                    ),
                  })
                }
              />
              <DemoButton
                style={styles.demoButton}
                labelStyle={{ fontSize: 13 }}
                label="Message Before Custom Content"
                onPress={() =>
                  this.showSimpleMessage("info", {
                    renderBeforeContent: () => (
                      <View style={{ padding: 9 }}>
                        <Text>This will be first</Text>
                      </View>
                    ),
                  })
                }
              />
              <DemoButton
                style={styles.demoButton}
                labelStyle={{ fontSize: 13 }}
                label="Message After Custom Content"
                onPress={() =>
                  this.showSimpleMessage("info", {
                    renderAfterContent: () => (
                      <View style={{ paddingTop: 9 }}>
                        <Text>This will be the last place to put some action buttons and etc</Text>
                        <DemoButton
                          style={[styles.demoButton, { marginLeft: 0, marginTop: 7, alignSelf: "flex-start" }]}
                          label="Action?"
                        />
                      </View>
                    ),
                  })
                }
              />
              <DemoButton
                style={styles.demoButton}
                labelStyle={{ fontSize: 14 }}
                label="Message Long Message"
                onPress={() =>
                  showMessage({
                    message: "Messsage Title",
                    description: "really long message really long message really long message wow so long Message",
                    type: "info",
                    icon: "info",
                  })
                }
              />
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
                label="Message from Navigation Modal"
                onPress={() => navigation.navigate("DemoModal")}
              />
              <DemoButton
                style={[styles.demoButton, { backgroundColor: "black" }]}
                label="Message from Native Modal"
                onPress={() => this.setState({ customModalVisible: true })}
              />
              <DemoButton
                style={[styles.demoButton, { backgroundColor: "black" }]}
                label="Message Local Instance"
                onPress={() => navigation.navigate("LocalInstance")}
              />
            </View>
            <Sepator />
            <View style={styles.group}>
              <DemoButton
                style={[styles.demoButton, { backgroundColor: FlashMessageManager.isEnabled ? "#C00" : "green" }]}
                labelStyle={{ fontSize: 14 }}
                label={FlashMessageManager.isEnabled ? "Disable all messages" : "Re-enable messages"}
                onPress={() => {
                  FlashMessageManager.setDisabled(FlashMessageManager.isEnabled ? true : false);
                  this.forceUpdate();
                }}
              />
            </View>
          </View>
        </ScrollView>
        <CustomModal
          modalVisible={this.state.customModalVisible}
          setModalVisible={customModalVisible => this.setState({ customModalVisible })}
        />
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
