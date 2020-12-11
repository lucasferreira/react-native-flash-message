/**
 * @flow
 */

import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MainScreen from "../screens/MainScreen";
import CustomTransitionScreen from "../screens/CustomTransitionScreen";
import EventsScreen from "../screens/EventsScreen";
import LocalInstanceScreen from "../screens/LocalInstanceScreen";

const MainStack = createStackNavigator();

export default function () {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#393939",
        },
        headerTintColor: "#fff",
        headerBackTitle: "Back",
      }}>
      <MainStack.Screen name="Main" component={MainScreen} />
      <MainStack.Screen name="CustomTransition" component={CustomTransitionScreen} />
      <MainStack.Screen name="Events" component={EventsScreen} />
      <MainStack.Screen name="LocalInstance" component={LocalInstanceScreen} />
    </MainStack.Navigator>
  );
}
