import React from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";

import { showMessage, hideMessage } from "react-native-flash-message";

import DemoButton from "../components/DemoButton";

export function YourCustomTransition(animValue, position = "top") {
  const opacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [360, 0],
  });

  return {
    transform: [{ translateX }],
    opacity,
  };
}

export default class CustomTransitionScreen extends React.Component {
  static navigationOptions = {
    title: "Custom Transition",
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
                onPress={() =>
                  showMessage({
                    message: "This message",
                    description: "Will shown with custom transition",
                    type: "warning",
                    transitionConfig: YourCustomTransition,
                  })
                }
              />
              <DemoButton style={styles.demoButton} label="Hide Message" onPress={() => hideMessage()} />
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
