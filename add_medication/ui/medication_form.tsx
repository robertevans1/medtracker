import React, { useState } from "react";
import { Text, View, TextInput, Button } from "react-native";
import TimesOfDoses from "./times_of_doses";
import { useMedications } from "../../dashboard/context/medication_context";
import Medication from "../../domain/medication";

interface MedicationFormProps {
  name: string | null;
  mgPerDose: number | null;
  mgPerTablet: number | null;
  timesOfDoses: Date[];
  firstDoseIndex: number | null;
  totalDoses: number | null;
}

const MedicationForm: React.FC = () => {
  const medicationController = useMedications().medicationController;

  const [medication, setMedication] = useState<MedicationFormProps>({
    name: null,
    mgPerDose: null,
    mgPerTablet: null,
    timesOfDoses: [],
    totalDoses: null,
    firstDoseIndex: null,
  });

  const handleInputChange = (
    name: keyof MedicationFormProps,
    value: string | number | null
  ) => {
    setMedication((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNumberChange = (
    name: keyof MedicationFormProps,
    value: string
  ) => {
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

  const handleSubmit = () => {
    console.log("Submitted Medication:", medication);
    if (medication.firstDoseIndex === null) {
      console.log("First dose index is undefined");
    } else if (medication.firstDoseIndex < 0) {
      console.log("First dose index is less than 0");
    } else if (medication.firstDoseIndex >= medication.timesOfDoses.length) {
      console.log(
        "First dose index is greater than or equal to the number of doses"
      );
    } else if (medication.timesOfDoses.length === 0) {
      console.log("There are no doses");
    } else if (medication.mgPerDose === null) {
      console.log("Mg per dose is undefined");
    } else if (medication.mgPerDose <= 0) {
      console.log("Mg per dose is less than or equal to 0");
    } else if (medication.mgPerTablet === null) {
      console.log("Mg per tablet is undefined");
    } else if (medication.mgPerTablet <= 0) {
      console.log("Mg per tablet is less than or equal to 0");
    } else if (medication.name?.trim() === "") {
      console.log("Name is empty");
    } else {
      console.log("Medication is valid");

      let med = new Medication({
        name: String(medication.name),
        mgPerDose: Number(medication.mgPerDose),
        mgPerTablet: Number(medication.mgPerTablet),
        timesOfDoses: medication.timesOfDoses as Date[],
        totalDoses: Number(medication.totalDoses),
        firstDoseIndex: Number(medication.firstDoseIndex),
      });

      medicationController.addMedication(med);
    }
  };

  return (
    <View>
      <Text>Name:</Text>
      <TextInput
        value={medication.name || ""}
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

      <Text>Number of Doses:</Text>
      <TextInput
        value={medication.totalDoses?.toString() || ""}
        onChangeText={(value) => handleNumberChange("totalDoses", value)}
        keyboardType="numeric"
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
