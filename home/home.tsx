import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import BottomTabNavigator from '../components/bottom_tab_navigator';
import Dashboard from '../dashboard/ui/dashboard';
import AddMedication from '../add_medication/ui/add_medication';

function Home(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // State to track the active tab
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Function to update the active tab
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          justifyContent: 'flex-end',
        }}>
        <BottomTabNavigator />
      </View>
    </SafeAreaView>
  );
}

export default Home;
