import React, { useEffect } from "react";
import { StyleSheet, View, StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import FlashMessage from "react-native-flash-message";

import MainStack from "./stacks/MainStack";
import ModalScreen from "./screens/ModalScreen";

const AppStack = createStackNavigator();

export default function App() {
  useEffect(() => {
    StatusBar.setBarStyle("light-content");
  }, []);

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
