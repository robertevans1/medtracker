import { SQLiteDatabase } from "react-native-sqlite-storage";
import { DatabaseExecutor } from "./database-executor";
import { createTables, dropTables } from "./db-service";

export const connectToTestDatabase = async () => {
  let db = SQLiteExecutor.openDatabase(
    "medications.db"
  ) as unknown as SQLiteDatabase;
  await dropTables(db);
  await createTables(db);
  return db;
};

export class SQLiteExecutor {
  constructor() {}
  public static openDatabase(name: string): DatabaseExecutor {
    return new DatabaseExecutor(name);
  }
}
