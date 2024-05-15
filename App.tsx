import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./home/home_screen";
import MedicationScreen from "./medication_screen/ui/medication_screen";
import { MedicationProvider } from "./dashboard/context/medication_context";
import HomeScreen from "./home/home_screen";

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <MedicationProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Medication" component={MedicationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </MedicationProvider>
  );
}

export default App;
