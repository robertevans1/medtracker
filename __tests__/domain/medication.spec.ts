import {
  connectToDatabase,
  createTables,
  dropTables,
  MedicationsService,
} from "../../db/db-service";
import Medication, { DoseStatus } from "../../domain/medication";
import { SQLiteDatabase } from "react-native-sqlite-storage";
import { DoseStatusWithTime } from "../../domain/medication";
import { SQLiteExecutor } from "../../db/sqlite-executor";

describe("MedicationsService", () => {
  let db: SQLiteDatabase;

  beforeAll(async () => {
    db = SQLiteExecutor.openDatabase(
      "medications.db"
    ) as unknown as SQLiteDatabase;
    await dropTables(db);
    await createTables(db);
  });

  afterEach(() => {
    // Clean up after each test
    // Optionally, you can delete test data from the database
  });

  afterAll(() => {
    // Optionally, close the database connection after all tests are done
    db.close();
  });

  // test the db contains the correct tables
  test("medications and dose_statuses tables should be present", async () => {
    // use a transaction to fetch the names of all the tables in the database, don't use executeSql
    const resultSet = await db.executeSql(
      'SELECT name FROM sqlite_master WHERE type="table"'
    );
    const tables = resultSet[0].rows.raw().map((row) => row.name);

    expect(tables).toContain("medications");
    expect(tables).toContain("dose_statuses");
  });

  test("saveMedication should save a medication with dose statuses", async () => {
    const medication: Medication = new Medication({
      name: "Medication 1",
      mgPerDose: 10,
      mgPerTablet: 100,
      timesOfDoses: [new Date()],
      firstDoseIndex: 0,
      doseStatuses: [
        DoseStatus.Future,
        DoseStatus.Missed,
        DoseStatus.Taken,
      ] as Array<DoseStatus>
    });

    const insertId = await MedicationsService.saveMedication(medication, db);

    expect(insertId).toBeDefined();
  });

  test("getAllMedications should retrieve all medications with dose statuses", async () => {
    const medications = await MedicationsService.getAllMedications(db);

    expect(medications).toBeDefined();
    expect(Array.isArray(medications)).toBe(true);

    // Ensure each medication has an ID
    medications.forEach((medication) => {
      console.log("Medication fetched is:", medication);
      expect(medication.id).toBeDefined();
    });
  });

  test("test that the medication retrieved is identical to the one saved", async () => {
    const medication: Medication = new Medication({
      name: "Medication 2",
      mgPerDose: 20,
      mgPerTablet: 200,
      timesOfDoses: [new Date()],
      firstDoseIndex: 0,
      doseStatuses: [
        DoseStatus.Future,
        DoseStatus.Missed,
        DoseStatus.Taken,
      ] as Array<DoseStatus>
    });

    const insertId = await MedicationsService.saveMedication(medication, db);

    const medications = await MedicationsService.getAllMedications(db);

    const fetchedMedication = medications.find(
      (med) => med.id === insertId
    );

    expect(fetchedMedication).toBeDefined();

    medication.id = insertId as number;
    expect(JSON.stringify(fetchedMedication)).toEqual(JSON.stringify(medication));

  });
});
