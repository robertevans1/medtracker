import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Text, View, TextInput, Button } from "react-native";
import TimesOfDoses from "./times_of_doses";

interface Medication {
  id?: number;
  name?: string;
  mgPerDose?: number;
  mgPerTablet?: number;
  timesOfDoses: Date[];
  firstDoseIndex?: number;
}

enum DoseStatus {
  Future = "Future",
  Missed = "Missed",
  Taken = "Taken",
}

const MedicationForm: React.FC = () => {
  const [medication, setMedication] = useState<Medication>({
    name: "",
    mgPerDose: 0,
    mgPerTablet: 0,
    timesOfDoses: [],
    firstDoseIndex: 0,
  });

  const handleInputChange = (
    name: keyof Medication,
    value: string | number | null
  ) => {
    setMedication((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNumberChange = (name: keyof Medication, value: string) => {
    value = value.replace(/\s/g, "");
    if (value === "") {
      return handleInputChange(name, null);
    } else {
      try {
        let int = parseInt(value);
        handleInputChange(name, int);
      } catch (error) {
        return;
      }
    }

    setMedication((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleSubmit = () => {
    console.log("Submitted Medication:", medication);
    // Perform further actions like saving to database
  };

  return (
    <View>
      <Text>Name:</Text>
      <TextInput
        value={medication.name}
        onChangeText={(value) => handleInputChange("name", value)}
      />

      <Text>mg Per Dose:</Text>
      <TextInput
        value={medication.mgPerDose?.toString() || ""}
        onChangeText={(value) => {
          handleNumberChange("mgPerDose", value);
        }}
        keyboardType="numeric"
      />

      <Text>mg Per Tablet:</Text>
      <TextInput
        value={medication.mgPerTablet?.toString() || ""}
        onChangeText={(value) => handleNumberChange("mgPerTablet", value)}
        keyboardType="numeric"
      />

      <TimesOfDoses
        timesOfDoses={medication.timesOfDoses}
        setTimesOfDoses={(newTimes) =>
          setMedication((prevMedication) => ({
            ...prevMedication,
            timesOfDoses: newTimes,
          }))
        }
      />

      <Text>First Dose Index:</Text>
      <TextInput
        value={medication.firstDoseIndex?.toString() || ""}
        onChangeText={(value) => handleNumberChange("firstDoseIndex", value)}
        keyboardType="numeric"
      />

      <Button title="Create Medication" onPress={handleSubmit} />
    </View>
  );
};

export default MedicationForm;
