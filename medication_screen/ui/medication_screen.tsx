import React from "react";
import { Text, View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/elements";
import styles from "../../styles/styles";
import Medication from "../../domain/medication";

function MedicationScreen({ route, navigation }): React.JSX.Element {
  const { medication } = route.params;
  console.log("MedicationScreen: ", medication);

  // Handler for navigating back
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Adding a custom back button in the header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderBackButton onPress={handleGoBack} />,
    });
  }, [navigation]);

  return (
    <View style={styles.tabViewStyle}>
      <Text>{medication.name}</Text>
      <Text>Times of Doses:</Text>
      {medication.timesOfDoses.map((timeOfDose, index) => (
        <Text key={index}>{timeOfDose.toString()}</Text>
      ))}
    </View>
  );
}

export default MedicationScreen;
