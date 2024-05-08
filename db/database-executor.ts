import { Database } from "sqlite3";
import { ResultSet, SQLiteDatabase } from "react-native-sqlite-storage";
import { TransactionExecutor } from "./transaction-executor";
const sqlite3 = require("sqlite3").verbose();

export class DatabaseExecutor {
  private db: Database;
  constructor(name: string) {
    this.db = new sqlite3.Database(name);
  }

  public transaction(
    callback: (tx: TransactionExecutor) => void
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const transaction = new TransactionExecutor(this.db, resolve, reject);
      this.db.serialize(() => {
        callback(transaction);
      });
    });
  }

  // provide interface for calling executeSql method which returns Promise<ResultSet[]>
  public executeSql(sqlStatement: string, args?: any[]): Promise<[ResultSet]> {
    return new Promise((resolve, reject) => {
      this.db.all(sqlStatement, args, (err: any, rows: any[]) => {
        if (err) {
          reject(err);
        }

        // Assuming rows is an array of objects representing the result set
        const resultSet: ResultSet = {
          insertId: 0, // Assuming the first row has an id field
          rowsAffected: 0, // Assuming no rows are affected
          rows: {
            length: rows.length,
            raw: () => rows,
            item: (index: number) => rows[index],
          },
        };
        resolve([resultSet]);
      });
    });
  }

  public close() {
    this.db.close();
  }
}
