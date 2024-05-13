import React from "react";
import { Text, View } from "react-native";
import { useMedications } from "../context/medication_context";
import styles from "../../styles/styles";
import MedicationCard from "./medication_card";

function Dashboard(): React.JSX.Element {
  const medicationContext = useMedications();

  return (
    <View style={styles.tabViewStyle}>
      <Text>Medications:</Text>
      <View>
        {medicationContext.medications.map((medication) => (
          <MedicationCard
            key={medication.id}
            medicationController={medicationContext.medicationController}
            medication={medication}
          />
        ))}
      </View>
    </View>
  );
}

export default Dashboard;
