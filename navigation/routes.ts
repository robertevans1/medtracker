import Medication from "../domain/medication";

type ParamList = {
    Home: undefined; // No parameters expected for HomeScreen
    MedicationScreen: { medication: Medication }; // ProfileScreen expects a userId parameter of type string
    // Add more route names and their corresponding parameter types as needed
  };

  export default ParamList;