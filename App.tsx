/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import Home from './home/home';
import {NavigationContainer} from '@react-navigation/native';
import {MedicationProvider} from './dashboard/context/medication_context';

function App(): React.JSX.Element {
  return (
    <MedicationProvider>
      <NavigationContainer>
        <Home />
      </NavigationContainer>
    </MedicationProvider>
  );
}

export default App;
