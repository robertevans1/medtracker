import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Text, View, TextInput, Button } from "react-native";

interface TimesOfDosesProps {
  timesOfDoses: Date[];
  setTimesOfDoses: (newTimes: Date[]) => void;
}

const TimesOfDoses: React.FC<TimesOfDosesProps> = ({
  timesOfDoses,
  setTimesOfDoses,
}) => {
  const handleDateChange = (date: Date, index: number | null) => {
    // Create a copy of the previous state to ensure immutability
    let newState: Date[];

    if (index !== null) {
      // Update the date at the specified index
      newState = timesOfDoses.map((d, i) => (i === index ? date : d));
    } else {
      // Add the new date to the array
      newState = [...timesOfDoses, date];
    }

    // Sort the new state and update the state
    setTimesOfDoses(newState.sort((a, b) => a.getTime() - b.getTime()));
  };

  const handleRemoveDate = (index: number) => {
    timesOfDoses.splice(index, 1);
    setTimesOfDoses([...timesOfDoses]);
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateIndex, setDateIndex] = useState<number | null>(null);

  const showDatePicker = (index: number | null) => {
    setDatePickerVisibility(true);
    setDateIndex(index);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleTimeChange = (date: Date) => {
    setDatePickerVisibility(false);
    handleDateChange(date, dateIndex);
  };

  return (
    <View>
      <Text>Times of Doses:</Text>
      {timesOfDoses.map((date, index) => (
        <View
          key={index}
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <Button
            title={date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            onPress={() => showDatePicker(index)}
          />
          <Button title="Remove" onPress={() => handleRemoveDate(index)} />
        </View>
      ))}

      <View style={{ alignItems: "center", marginTop: 20 }}>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="time"
          display="spinner"
          onConfirm={handleTimeChange}
          onCancel={hideDatePicker}
        />
        <Button title="Add Time" onPress={() => showDatePicker(null)} />
      </View>
    </View>
  );
};

export default TimesOfDoses;
