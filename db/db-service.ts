// app/db/db.ts

import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from "react-native-sqlite-storage";
import Medication from "../domain/medication";
import { DoseStatus } from "../domain/medication";

// Enable promise for SQLite
enablePromise(true);

export const connectToDatabase = async () => {
  let db = await openDatabase({
    name: "medications.db",
    location: "default",
  });
  await dropTables(db); // temp while testing
  await createTables(db);
  return db;
};

export const createTables = async (db: SQLiteDatabase) => {
  const medicationsQuery = `
      CREATE TABLE IF NOT EXISTS medications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        mgPerDose INTEGER,
        mgPerTablet INTEGER,
        timesOfDoses TEXT,
        totalDoses INTEGER,
        firstDoseIndex INTEGER
      )
    `;
  const doseStatusesQuery = `
     CREATE TABLE IF NOT EXISTS dose_statuses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        medication_id INTEGER,
        status TEXT,
        FOREIGN KEY (medication_id) REFERENCES medications(id)
     )
    `;
  try {
    await db.executeSql(medicationsQuery);
    await db.executeSql(doseStatusesQuery);
    console.log("Tables created successfully");
  } catch (error) {
    console.error(error);
    throw Error(`Failed to create tables`);
  }
};

export const dropTables = async (db: SQLiteDatabase) => {
  const medicationsQuery = `DROP TABLE IF EXISTS medications`;
  const doseStatusesQuery = `DROP TABLE IF EXISTS dose_statuses`;
  try {
    await db.executeSql(medicationsQuery);
    await db.executeSql(doseStatusesQuery);
    console.log("Tables dropped successfully");
  } catch (error) {
    console.error(error);
    throw Error(`Failed to drop tables`);
  }
};

// Medications service
const MedicationsService = {
  // Save medication with dose statuses
  saveMedication: (medication: Medication, db: SQLiteDatabase) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        console.log('attempt to insert medication')
        tx.executeSql(
          `INSERT INTO medications (name, mgPerDose, mgPerTablet, timesOfDoses, firstDoseIndex)
                     VALUES (?, ?, ?, ?, ?)`,
          [
            medication.name,
            medication.mgPerDose,
            medication.mgPerTablet,
            JSON.stringify(
              medication.timesOfDoses.map((date) => date.toISOString())
            ),
            medication.firstDoseIndex,
          ],
          (_, { insertId }) => {
            // Insert dose statuses for the medication
            console.log('attempt to insert dose statuses at medication id:', insertId, 'with statuses:', medication.doseStatuses)
            medication.doseStatuses.forEach((status: DoseStatus) => {
              tx.executeSql(
                `INSERT INTO dose_statuses (medication_id, status)
                                 VALUES (?, ?)`,
                [insertId, status],
                (_, { insertId: statusId }) => {
                  // Dose status inserted successfully
                  console.log('dose status inserted successfully:', statusId)
                },
                (_, error) => {
                  console.error("Error inserting dose status:", error);
                }
              );
            });
            resolve(insertId);
          },
          (_, error) => {
            console.error("Error saving medication:", error);
            reject(error);
          }
        );
      });
    });
  },
  // Retrieve all medications with dose statuses
  getAllMedications: (db: SQLiteDatabase): Promise<Medication[]> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT m.*, ds.status 
                     FROM medications m
                     LEFT JOIN dose_statuses ds ON m.id = ds.medication_id`,
          [],
          (_, { rows }) => {
            const medicationsMap = new Map();
            console.log('rows:', rows)
            for (let i = 0; i < rows.length; i++) {
              let row = rows.item(i);

              const medicationId = row.id;
              if (!medicationsMap.has(medicationId)) {
                // Create new medication object
                const medication = new Medication({
                  id: row.id,
                  name: row.name,
                  mgPerDose: row.mgPerDose,
                  mgPerTablet: row.mgPerTablet,
                  timesOfDoses: JSON.parse(row.timesOfDoses).map(
                    (isoString: string) => new Date(isoString)
                  ),
                  totalDoses: row.totalDoses,
                  firstDoseIndex: row.firstDoseIndex,
                  doseStatuses: [] as DoseStatus[], // Initialize dose statuses array
                });
                medicationsMap.set(medicationId, medication);
              }
              // Add dose status to medication's dose statuses array
              if (row.status) {
                medicationsMap.get(medicationId).doseStatuses.push(row.status);
              }
            }
            // Convert medications map to array
            const medications = Array.from(medicationsMap.values());
            resolve(medications);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  },

  // Update medication and associated dose statuses
  updateMedication: (medication: Medication, db: SQLiteDatabase) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `UPDATE medications SET name = ?, mgPerDose = ?, mgPerTablet = ?, timesOfDoses = ?, firstDoseIndex = ?
                     WHERE id = ?`,
          [
            medication.name,
            medication.mgPerDose,
            medication.mgPerTablet,
            JSON.stringify(
              medication.timesOfDoses.map((date) => date.toISOString())
            ),
            medication.firstDoseIndex,
            medication.id,
          ],
          (_, { rowsAffected }) => {
            resolve(rowsAffected);
          },
          (_, error) => {
            reject(error);
          }
        );
        // Delete all dose statuses for the medication
        tx.executeSql(
          `DELETE FROM dose_statuses WHERE medication_id = ?`,
          [medication.id],
          (_, { rowsAffected }) => {
            // Dose statuses deleted
          },
          (_, error) => {
            console.error("Error deleting dose statuses:", error);
          }
        );
        // Insert new dose statuses for the medication
        medication.doseStatuses.forEach((status: DoseStatus) => {
          tx.executeSql(
            `INSERT INTO dose_statuses (medication_id, status)
                             VALUES (?, ?)`,
            [medication.id, status],
            (_, { insertId }) => {
              // Dose status inserted successfully
            },
            (_, error) => {
              console.error("Error inserting dose status:", error);
            }
          );
        });
      });
    });
  },

  // Remove a medication and associated dose statuses
  removeMedication: (medicationId: number, db: SQLiteDatabase) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `DELETE FROM medications WHERE id = ?`,
          [medicationId],
          (_, { rowsAffected }) => {
            resolve(rowsAffected);
          },
          (_, error) => {
            reject(error);
          }
        );
        tx.executeSql(
          `DELETE FROM dose_statuses WHERE medication_id = ?`,
          [medicationId],
          (_, { rowsAffected }) => {
            // Dose statuses deleted
          },
          (_, error) => {
            console.error("Error deleting dose statuses:", error);
          }
        );
      });
    });
  },
};


export { MedicationsService };
