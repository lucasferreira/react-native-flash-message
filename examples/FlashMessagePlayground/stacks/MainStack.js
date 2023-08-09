/**
 * @flow
 */

import React, { Component } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainScreen from "../screens/MainScreen";
import CustomTransitionScreen from "../screens/CustomTransitionScreen";
import EventsScreen from "../screens/EventsScreen";
import LocalInstanceScreen from "../screens/LocalInstanceScreen";

const MainStack = createNativeStackNavigator();

export default function () {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#393939",
        },
        headerTintColor: "#fff",
        headerBackTitle: "Back",
      }}
    >
      <MainStack.Screen name="Main" component={MainScreen} options={{ title: "Flash Message Demo" }} />
      <MainStack.Screen name="CustomTransition" component={CustomTransitionScreen} />
      <MainStack.Screen name="Events" component={EventsScreen} />
      <MainStack.Screen name="LocalInstance" component={LocalInstanceScreen} />
    </MainStack.Navigator>
  );
}
