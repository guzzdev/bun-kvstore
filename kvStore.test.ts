import { describe, it, expect, beforeEach } from "bun:test";
import { KVStore } from "./bun"; // Adjust the import path as necessary

describe("KVStore", () => {
  const kvStore = new KVStore("test_kv_store");

  // Clear the KV store before each test
  beforeEach(async () => {
    await kvStore.clear();
  });

  it("should set and get a value", async () => {
    await kvStore.set("testKey", { name: "Test", value: 123 });
    const value = await kvStore.get("testKey");
    expect(value).toEqual({ name: "Test", value: 123 });
  });

  it("should return null for a non-existent key", async () => {
    const value = await kvStore.get("nonExistentKey");
    expect(value).toBeNull();
  });

  it("should delete a value", async () => {
    await kvStore.set("deleteKey", { name: "Delete", value: 456 });
    await kvStore.delete("deleteKey");
    const value = await kvStore.get("deleteKey");
    expect(value).toBeNull();
  });

  it("should list all key-value pairs", async () => {
    await kvStore.batchSet([
      { key: "listKey1", value: { data: "value1" } },
      { key: "listKey2", value: { data: "value2" } },
    ]);
    const allValues = await kvStore.list();
    expect(allValues.length).toBe(2);
    expect(allValues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "listKey1", value: { data: "value1" } }),
        expect.objectContaining({ key: "listKey2", value: { data: "value2" } }),
      ])
    );
  });

  it("should clear all entries", async () => {
    await kvStore.batchSet([
      { key: "clearKey1", value: { data: "value1" } },
      { key: "clearKey2", value: { data: "value2" } },
    ]);
    await kvStore.clear();
    const allValues = await kvStore.list();
    expect(allValues.length).toBe(0);
  });

  it("should batch delete keys", async () => {
    await kvStore.batchSet([
      { key: "batchKey1", value: { data: "value1" } },
      { key: "batchKey2", value: { data: "value2" } },
    ]);
    await kvStore.batchDelete(["batchKey1", "batchKey2"]);
    const allValues = await kvStore.list();
    expect(allValues.length).toBe(0);
  });

  it("should overwrite a value when setting the same key", async () => {
    await kvStore.set("overwriteKey", { data: "initialValue" });
    await kvStore.set("overwriteKey", { data: "newValue" });
    const value = await kvStore.get("overwriteKey");
    expect(value).toEqual({ data: "newValue" });
  });

  it("should handle batch setting with duplicate keys", async () => {
    await kvStore.batchSet([
      { key: "duplicateKey", value: { data: "value1" } },
      { key: "duplicateKey", value: { data: "value2" } },
    ]);
    const value = await kvStore.get("duplicateKey");
    expect(value).toEqual({ data: "value2" }); // Should be the last value set
  });

  it("should not throw an error when deleting a non-existent key", async () => {
    await kvStore.delete("nonExistentKey"); // Should not throw
    const value = await kvStore.get("nonExistentKey");
    expect(value).toBeNull(); // Still should be null
  });

  it("should not throw an error when clearing an already empty store", async () => {
    await kvStore.clear(); // Should not throw
    const allValues = await kvStore.list();
    expect(allValues.length).toBe(0); // Still should be empty
  });

  it("should handle batch deleting non-existent keys gracefully", async () => {
    await kvStore.batchSet([
      { key: "existingKey", value: { data: "value" } },
    ]);
    await kvStore.batchDelete(["nonExistentKey1", "nonExistentKey2"]); // Should not throw
    const allValues = await kvStore.list();
    expect(allValues.length).toBe(1); // Should still have the existing key
  });
}); 