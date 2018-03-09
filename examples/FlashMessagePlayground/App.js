import React from "react";
import { StatusBar, View } from "react-native";

import FlashMessage from "react-native-flash-message";

import AppStack from "./stacks/AppStack";

export default class App extends React.Component {
  componentDidMount() {
    StatusBar.setBarStyle("light-content");
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppStack />
        {/* GLOBAL FLASH MESSAGE COMPONENT INSTANCE */}
        <FlashMessage position="top" animated={true} />
      </View>
    );
  }
}
