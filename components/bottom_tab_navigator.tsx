import React from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import Dashboard from '../dashboard/ui/dashboard';
import AddMedication from '../add_medication/ui/add_medication';
import Calendar from '../calendar/ui/calendar';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Create the TabNavigator
const Tab = createBottomTabNavigator<{}>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={size} color={color} />
          ),
          tabBarLabel: 'Dashboard',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={Calendar}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="calendar" size={size} color={color} />
          ),
          tabBarLabel: 'Calendar',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Add Medication"
        component={AddMedication}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="plus" size={size} color={color} />
          ),
          tabBarLabel: 'Add Medication',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
