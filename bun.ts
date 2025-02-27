import { Database } from "bun:sqlite";

export class KVStore {
  private db: Database;

  constructor(dbName: string) {
    this.db = new Database(dbName);
    this.initialize();
  }

  private initialize() {
    this.db.run(`CREATE TABLE IF NOT EXISTS kv_store (
      key TEXT PRIMARY KEY,
      value TEXT
    )`);
  }

  public async set(key: string, value: any): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      this.db.run(
        "INSERT OR REPLACE INTO kv_store (key, value) VALUES (?, ?)",
        [key, serializedValue]
      );
      console.log(`Set key: ${key}`);
    } catch (error) {
      console.error("Error setting value:", error);
    }
  }

  public async get(key: string): Promise<any | null> {
    try {
      const result = this.db
        .query("SELECT value FROM kv_store WHERE key = ?")
        .get(key);
      return result ? JSON.parse(result.value) : null;
    } catch (error) {
      console.error("Error getting value:", error);
      return null;
    }
  }

  public async delete(key: string): Promise<void> {
    try {
      this.db.run("DELETE FROM kv_store WHERE key = ?", [key]);
      console.log(`Deleted key: ${key}`);
    } catch (error) {
      console.error("Error deleting value:", error);
    }
  }

  public async list(): Promise<{ key: string; value: any }[]> {
    try {
      const rows = this.db.query("SELECT * FROM kv_store").all();
      return rows.map((row) => ({
        key: row.key,
        value: JSON.parse(row.value),
      }));
    } catch (error) {
      console.error("Error listing values:", error);
      return [];
    }
  }

  public async clear(): Promise<void> {
    try {
      this.db.run("DELETE FROM kv_store");
      console.log("Cleared all key-value pairs");
    } catch (error) {
      console.error("Error clearing values:", error);
    }
  }

  public async batchSet(entries: { key: string; value: any }[]): Promise<void> {
    try {
      const stmt = this.db.prepare(
        "INSERT OR REPLACE INTO kv_store (key, value) VALUES (?, ?)"
      );
      for (const { key, value } of entries) {
        const serializedValue = JSON.stringify(value);
        stmt.run(key, serializedValue);
      }
      stmt.finalize();
      console.log(`Batch set ${entries.length} entries`);
    } catch (error) {
      console.error("Error in batch setting values:", error);
    }
  }

  public async batchDelete(keys: string[]): Promise<void> {
    try {
      const stmt = this.db.prepare("DELETE FROM kv_store WHERE key = ?");
      for (const key of keys) {
        stmt.run(key);
      }
      stmt.finalize();
      console.log(`Batch deleted ${keys.length} keys`);
    } catch (error) {
      console.error("Error in batch deleting values:", error);
    }
  }
}