import React from 'react';
import {Text, View, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

function Calendar(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View
      style={{
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>The Calendar screen</Text>
    </View>
  );
}

export default Calendar;