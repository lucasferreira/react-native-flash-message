/**
 * @flow
 */

import React, { Component } from "react";
import { StackNavigator } from "react-navigation";

import MainScreen from "../screens/MainScreen";
import CustomTransitionScreen from "../screens/CustomTransitionScreen";
import EventsScreen from "../screens/EventsScreen";
import LocalInstanceScreen from "../screens/LocalInstanceScreen";

const MainStack = StackNavigator(
  {
    Main: {
      screen: MainScreen,
    },
    CustomTransition: {
      screen: CustomTransitionScreen,
    },
    Events: {
      screen: EventsScreen,
    },
    LocalInstance: {
      screen: LocalInstanceScreen,
    },
  },
  {
    headerMode: "screen",
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#393939",
      },
      headerTintColor: "#fff",
      headerTruncatedBackTitle: "Back",
    },
  }
);

export default MainStack;
