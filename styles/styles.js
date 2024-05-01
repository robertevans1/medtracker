import {
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
    viewStyle: {
      flex: 1,
      backgroundColor: Colors.black,
      justifyContent: 'flex-end',
    },
    tabViewStyle: {
      backgroundColor: Colors.white,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

  });

  export default styles;