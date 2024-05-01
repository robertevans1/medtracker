import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useMedications} from '../context/medication_context';
import Medication from '../../domain/medication';
import styles from '../../styles/styles';

function Dashboard(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const medications = useMedications();

  return (
    <View style={styles.tabViewStyle}>
      <Text>Medications:</Text>
      <View>
        {medications.map(medication => (
          <Text key={medication.id}>
            {'Name: '} {medication.name} {'\n'}
            {'Previous: '}
            {medication.getPreviousStatusWithTime()?.toString()} {'\n'}
            {' Next: '}
            {medication.getNextStatusWithTime()?.toString()}
          </Text>
        ))}
      </View>
    </View>
  );
}

export default Dashboard;
