import MedicationRepository from "./medication_repository";
import Medication from "../../domain/medication";
import moment from "moment";

class DummyMedicationRepository implements MedicationRepository {
  async fetchMedicationsForUser(userId: string): Promise<Medication[]> {
    // Here you would typically fetch medications from a database or API based on the userId,
    // but for demonstration purposes, we'll just return dummy data

    // Dummy medications
    const medications: Medication[] = [
      new Medication({
        id: "1",
        name: "Lymecycline",
        mgPerDose: 408,
        mgPerTablet: 408,
        timesOfDoses: [new Date(2024, 3, 4, 10, 30)],
        totalDoses: 84,
        firstDoseIndex: 0,
      }),
      // new Medication({
      //   id: '2',
      //   name: 'Ibuprofen',
      //   mgPerDose: 200,
      //   mgPerTablet: 100,
      //   timesOfDoses: [this.time('09:00')],
      //   totalDoses: 20,
      //   firstDoseTime: new Date(2024, 3, 4, 9, 0),
      // })
    ];

    return medications;
  }
}

export default DummyMedicationRepository;
