import React from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";

import { showMessage, hideMessage } from "react-native-flash-message";

import DemoButton from "../components/DemoButton";

export default class EventsScreen extends React.Component {
  static navigationOptions = {
    title: "Message Events",
  };
  constructor(props) {
    super(props);

    this.state = {
      hasPressed: false,
      hasShown: false,
      hasHidden: false,
    };
  }
  messagePress() {
    this.setState({ hasPressed: true });
  }
  messageShow() {
    this.setState({ hasShown: true });
  }
  messageHide() {
    this.setState({ hasHidden: true });
  }
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
                  // reseting
                  this.setState({ hasPressed: false, hasShown: false, hasHidden: false });

                  // show the new flash message
                  showMessage({
                    message: "This message (press me)",
                    description: "Will register some events",
                    onPress: this.messagePress.bind(this),
                    onShow: this.messageShow.bind(this),
                    onHide: this.messageHide.bind(this),
                    type: "info",
                  });
                }}
              />
              <DemoButton style={styles.demoButton} label="Hide Message" onPress={() => hideMessage()} />
            </View>
            <Text style={styles.text}>Has Pressed: {this.state.hasPressed ? "Yes" : "No"}</Text>
            <Text style={styles.text}>Has Shown: {this.state.hasShown ? "Yes" : "No"}</Text>
            <Text style={styles.text}>Has Hidden: {this.state.hasHidden ? "Yes" : "No"}</Text>
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
    alignSelf: "auto",
    marginBottom: 9,
    marginHorizontal: 5,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    textAlign: "center",
  },
});
