import React from "react";
import { Button, Text, View, useColorScheme } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { MedicationController } from "../context/medication_context";
import { useNavigation } from "@react-navigation/native";
import ParamList from "../../navigation/routes";

import Medication, {
  DoseStatus,
  DoseStatusType,
} from "../../domain/medication";
import MedicationScreen from "../../medication_screen/ui/medication_screen";

function MedicationCard({
  medicationController,
  medication,
}: {
  medicationController: MedicationController;
  medication: Medication;
}): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const navigation = useNavigation();

  const previousStatus = medication.getPreviousStatusWithTime();
  const nextStatus = medication.getNextStatusWithTime();

  return (
    <View style={backgroundStyle}>
      <Text key={medication.id}>
        {"Name: "} {medication.name} {"\n"}
        {/* If time for previous status is today, display the approriate
        component for the status, otherwise nothing */}
        {previousStatus !== null && isToday(previousStatus.date!)
          ? medication.getPreviousStatusWithTime()?.type ===
            DoseStatusType.Unknown
            ? PreviousStatusUnknown({
                time: previousStatus.date!,
                medicationController,
                medication,
                doseStatusIndex: previousStatus.index,
              })
            : medication.getPreviousStatusWithTime()?.type ===
              DoseStatusType.Taken
            ? PreviousStatusTaken({
                time: previousStatus.date!,
              })
            : PreviousStatusMissed({
                time: previousStatus.date!,
              })
          : null}
        {"\n"}
        {" Next: "}
        {medication.getNextStatusWithTime()?.toString()}
      </Text>

      <Button
        title="View"
        onPress={() => {
          console.log(
            "Navigating to MedicationScreen with medication   ",
            medication
          );
          return navigation.navigate("Medication", { medication: medication });
        }}
      />
    </View>
  );
}

// is date today
function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// If previous status is unknown, display "Have you taken your 'time' dose today?" with a button for "Yes"
function PreviousStatusUnknown({
  time,
  medicationController,
  medication,
  doseStatusIndex,
}: {
  time: Date;
  medicationController: MedicationController;
  medication: Medication;
  doseStatusIndex: number;
}): React.JSX.Element {
  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View>
      <View>
        <Text>Have you taken your {formattedTime} dose today?</Text>
        <Button
          title="Yes"
          onPress={() => {
            console.log(
              "Updating dose status to taken at index",
              doseStatusIndex
            );
            medicationController.updateMedication(
              updateMedicationDoseStatus(
                medication,
                DoseStatusType.Taken,
                doseStatusIndex
              )
            );
          }}
        />
      </View>
    </View>
  );
}

function updateMedicationDoseStatus(
  medication: Medication,
  type: DoseStatusType,
  doseStatusIndex: number
): Medication {
  const updatedDoseStatuses = medication.doseStatuses.map((status, _) => {
    if (status.index !== doseStatusIndex) {
      return status;
    } else {
      return new DoseStatus({
        type: type,
        index: status.index,
        date: status.date,
      });
    }
  });

  return new Medication({
    ...medication,
    doseStatuses: updatedDoseStatuses,
  });
}

// If previous status is taken, display "You took your 'time' dose at 'time'
function PreviousStatusTaken({ time }: { time: Date }): React.JSX.Element {
  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View>
      <View>
        <Text>You took your {formattedTime} dose already 👍</Text>
      </View>
    </View>
  );
}

// If previous status is missed, display "You missed the dose at 'time'.
function PreviousStatusMissed({ time }: { time: Date }): React.JSX.Element {
  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View>
      <View>
        <Text>You missed the dose at {formattedTime} 😞</Text>
      </View>
    </View>
  );
}

export default MedicationCard;
