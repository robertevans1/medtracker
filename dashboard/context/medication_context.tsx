// MedicationContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
import DummyMedicationRepository from "../repository/dummy_medication_repository";
import Medication from "../../domain/medication";
import SqlMedicationRepository from "../repository/sql_medication_repository";
import { connectToDatabase } from "../../db/db-service";

export interface MedicationController {
  addMedication: (medication: Medication) => Promise<void>;
  updateMedication: (medication: Medication) => Promise<void>;
  removeMedication: (medication_id: number) => Promise<void>;
}

// Create Medication Context
interface MedicationContextType {
  medications: Medication[];
  medicationController: MedicationController;
}

const MedicationContext = createContext<MedicationContextType>({
  medications: [],
  medicationController: {
    addMedication: async () => {},
    updateMedication: async () => {},
    removeMedication: async () => {},
  },
});

const repository = new SqlMedicationRepository(connectToDatabase());

// Medication Provider Component
export const MedicationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const fetchedMedications = await fetchMedicationsFromRepository();
        setMedications(fetchedMedications);
        console.log("Fetched medications are:", fetchedMedications);
      } catch (error) {
        console.error("Error fetching medications:", error);
        // Handle error
      }
    };

    fetchMedications();

    // Optionally return a cleanup function if needed
    // return () => {
    //   // Cleanup code here
    // };
  }, []);

  const addMedication = async (medication: Medication) => {
    // Add medication to repository
    await repository.addMedication(medication);
    // Fetch updated medications from repository
    const updatedMedications = await fetchMedicationsFromRepository();
    // Update medications in state
    setMedications(updatedMedications);
  };

  const updateMedication = async (medication: Medication) => {
    // Update medication in repository
    await repository.updateMedication(medication);
    // Fetch updated medications from repository
    const updatedMedications = await fetchMedicationsFromRepository();
    // Update medications in state
    setMedications(updatedMedications);
  };

  const removeMedication = async (medication_id: number) => {
    // Remove medication from repository
    await repository.removeMedication(medication_id);
    // Fetch updated medications from repository
    const updatedMedications = await fetchMedicationsFromRepository();
    // Update medications in state
    setMedications(updatedMedications);
  };

  const medicationController: MedicationController = {
    addMedication,
    updateMedication,
    removeMedication,
  };

  const contextValue: MedicationContextType = {
    medications,
    medicationController,
  };

  return (
    <MedicationContext.Provider value={contextValue}>
      {children}
    </MedicationContext.Provider>
  );
};

// Custom hook to access medication data
export const useMedications = () => useContext(MedicationContext);

const fetchMedicationsFromRepository = async () => {
  let medications = await repository.fetchMedicationsForUser("1");
  console.log("Fetched medications are:", medications);
  return medications;
};
