import { Database } from "sqlite3";
import { ResultSet } from "react-native-sqlite-storage";
const sqlite3 = require("sqlite3").verbose();

export class TransactionExecutor {
  private db: Database;
  private resolve: () => void;
  private reject: (mess: any) => void;
  private callsAmount = 0;
  constructor(
    _db: Database,
    _resolve: (value?: unknown) => void,
    _reject: (reason?: any) => void
  ) {
    this.db = _db;
    this.resolve = _resolve;
    this.reject = _reject;
  }

  public executeSql(
    statement: string,
    args?: string[],
    callback?: (tx: TransactionExecutor, results: ResultSet) => void,
    errorCallback?: (tx: TransactionExecutor, results: any) => void
  ): void {
    this.callsAmount++;
    // sqlite3 have many dedicated methods for calling sql, but 'all' is quite universal
    this.db.all(statement, args, (err: any, rows: any[]) => {
      if (err) {
        if (errorCallback) errorCallback(this, err);
        this.reject(err);
      }

      const tmp: ResultSet = {
        insertId: rows[0]?.id || 0,
        rowsAffected: 0, 
        rows: {
          length: rows.length,
          raw: () => rows,
          item: (index: number) => rows[index],
        },
      };
      if (callback) callback(this, tmp);

      this.callsAmount--;

      if (this.callsAmount == 0) {
        this.resolve();
      }
    });
  }
}
