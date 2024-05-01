// MedicationContext.js
import React, {createContext, useState, useEffect, useContext} from 'react';
import DummyMedicationRepository from '../repository/dummy_medication_repository';
import Medication from '../../domain/medication';

// Create Medication Context
const MedicationContext = createContext<Medication[]>([]);

const respository = new DummyMedicationRepository();

// Medication Provider Component
export const MedicationProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const fetchedMedications = await fetchMedicationsFromRepository();
        setMedications(fetchedMedications);
        console.log('Fetched medications are:', fetchedMedications);
      } catch (error) {
        console.error('Error fetching medications:', error);
        // Handle error
      }
    };

    fetchMedications();

    // Optionally return a cleanup function if needed
    // return () => {
    //   // Cleanup code here
    // };
  }, []);

  return (
    <MedicationContext.Provider value={medications}>
      {children}
    </MedicationContext.Provider>
  );
};

// Custom hook to access medication data
export const useMedications = () => useContext(MedicationContext);

const fetchMedicationsFromRepository = async () => {
  return respository.fetchMedicationsForUser('1');
};
