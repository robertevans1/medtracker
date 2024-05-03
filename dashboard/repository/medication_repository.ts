import Medication from "../../domain/medication";

interface MedicationRepository {
  fetchMedicationsForUser(userId: string): Promise<Medication[]>;
}

export default MedicationRepository;
