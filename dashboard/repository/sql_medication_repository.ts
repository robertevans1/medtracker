import MedicationRepository from "./medication_repository";
import Medication from "../../domain/medication";

class SqlMedicationRepository implements MedicationRepository {
  async fetchMedicationsForUser(userId: string): Promise<Medication[]> {
    // todo - query sql database for medications

    // temporary dummy data
    const medications: Medication[] = [];
    return medications;
  }
}

export default SqlMedicationRepository;
