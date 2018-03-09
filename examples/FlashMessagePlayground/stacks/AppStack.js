/**
 * @flow
 */

import React, { Component } from "react";
import { Platform } from "react-native";
import { StackNavigator } from "react-navigation";

import MainStack from "./MainStack";
import ModalScreen from "../screens/ModalScreen";

// create custom transitioner without the opacity animation, ie. for iOS
function forVertical(props) {
  const { layout, position, scene } = props;

  const index = scene.index;
  const height = layout.initHeight;

  const translateX = 0;
  const translateY = position.interpolate({
    inputRange: ([index - 1, index, index + 1]: Array<number>),
    outputRange: ([height, 0, 0]: Array<number>),
  });

  return {
    transform: [{ translateX }, { translateY }],
  };
}

const AppStack = StackNavigator(
  {
    MainStack: {
      screen: MainStack,
    },
    DemoModal: {
      screen: ModalScreen,
    },
  },
  {
    mode: "modal",
    headerMode: "none",
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
    transitionConfig: () => (Platform.OS === "ios" ? { screenInterpolator: forVertical } : {}),
    cardStyle:
      Platform.OS === "ios"
        ? {
            backgroundColor: "transparent",
          }
        : {},
  }
);

export default AppStack;
