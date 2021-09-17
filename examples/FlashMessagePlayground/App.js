import React from "react";
import { StyleSheet, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FlashMessage from "react-native-flash-message";

import MainStack from "./stacks/MainStack";
import ModalScreen from "./screens/ModalScreen";

const AppStack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <AppStack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: "#393939",
            },
            headerTintColor: "#fff",
            headerBackTitle: "Back",
          }}>
          <AppStack.Screen name="MainStack" component={MainStack} options={{ headerShown: false }} />
          <AppStack.Screen name="DemoModal" component={ModalScreen} />
        </AppStack.Navigator>
      </NavigationContainer>
      {/* GLOBAL FLASH MESSAGE COMPONENT INSTANCE */}
      <FlashMessage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
