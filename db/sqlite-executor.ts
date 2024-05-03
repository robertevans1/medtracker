import { DatabaseExecutor } from "./database-executor";
const sqlite3 = require("sqlite3").verbose();

export class SQLiteExecutor {
  constructor() {}
  public static openDatabase(name: string): DatabaseExecutor {
    return new DatabaseExecutor(name);
  }
}
