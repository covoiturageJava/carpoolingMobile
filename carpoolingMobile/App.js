import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginView from "./src/views/LoginView";
import HomeView from "./src/views/HomeView";

const Stack = createStackNavigator();

// const serverIpAddress = process.env.SERVER_IP_ADDRESS;
const serverIpAddress = "192.168.137.57";

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {(props) => (
            <LoginView {...props} serverIpAddress={serverIpAddress} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {(props) => <HomeView {...props} serverIpAddress={serverIpAddress} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
