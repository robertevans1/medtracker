import MedicationRepository from "./medication_repository";
import Medication from "../../domain/medication";
import { SQLiteDatabase } from "react-native-sqlite-storage";
import { MedicationsService, connectToDatabase } from "../../db/db-service";

class SqlMedicationRepository implements MedicationRepository {
  
  dbPromise: Promise<SQLiteDatabase>;

  constructor(dbPromise: Promise<SQLiteDatabase>) {
    this.dbPromise = dbPromise;
  }

  destroy(): void {
    // close db connection
    this.dbPromise.then((db) => db.close()); 
  }

  async addMedication(medication: Medication): Promise<void> {
    let db = await this.dbPromise;
    await MedicationsService.saveMedication(medication, db);
  }

  async updateMedication(medication: Medication): Promise<void> {
    let db = await this.dbPromise;
    await MedicationsService.updateMedication(medication, db);
  }

  async removeMedication(medication_id: number): Promise<void> {
    let db = await this.dbPromise;
    await MedicationsService.removeMedication(medication_id, db);
  }
  async fetchMedicationsForUser(userId: string): Promise<Medication[]> {
    let db = await this.dbPromise;
    return await MedicationsService.getAllMedications(db);
  }
}

export default SqlMedicationRepository;
