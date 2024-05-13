import Medication from "../../domain/medication";

interface MedicationRepository {
  fetchMedicationsForUser(userId: string): Promise<Medication[]>;
  addMedication(medication: Medication): Promise<void>;
  removeMedication(medication_id: number): Promise<void>;
  updateMedication(medication: Medication): Promise<void>;
}

export default MedicationRepository;
