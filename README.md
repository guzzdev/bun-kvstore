
# Bun KVStore

KVStore is a simple key-value store implementation using bun SQLite, designed for easy storage and retrieval of data in a structured format.

## Installation

To install the KVStore package, you can use npm or yarn. Run the following command in your project directory:

```bash
bun install bun-kvstore
```

## Usage

### Importing the KVStore

First, import the `KVStore` class into your project:

```typescript
import { KVStore } from 'bun-kvstore';
```

### Creating an Instance

Create an instance of the `KVStore` by providing a database name:
If empty, the database will be created in the memory.

```typescript
const store = new KVStore('my-database.db');
```


### Setting a Value

You can set a key-value pair using the `set` method:

```typescript
await store.set('myKey', { name: 'John Doe', age: 30 });
```

### Getting a Value

To retrieve a value by its key, use the `get` method:

```typescript
const value = await store.get('myKey');
console.log(value); // Output: { name: 'John Doe', age: 30 }
```

### Deleting a Value

To delete a key-value pair, use the `delete` method:

```typescript
await store.delete('myKey');
```

### Listing All Key-Value Pairs

You can list all key-value pairs stored in the database:

```typescript
const allEntries = await store.list();
console.log(allEntries); // Output: [{ key: 'myKey', value: { name: 'John Doe', age: 30 } }, ...]
```

### Clearing All Key-Value Pairs

To clear all entries in the store, use the `clear` method:

```typescript
await store.clear();
```

### Batch Operations

You can set multiple key-value pairs at once using `batchSet`:

```typescript
await store.batchSet([
  { key: 'key1', value: 'value1' },
  { key: 'key2', value: { data: 'value2' } },
]);
```

And delete multiple keys using `batchDelete`:

```typescript
await store.batchDelete(['key1', 'key2']);
```

## API Documentation

### `KVStore`

#### Constructor

- `constructor(dbName: string)`: Initializes a new instance of the KVStore with the specified database name.

#### Methods

- `set(key: string, value: KVStoreValue): Promise<void>`: Sets a key-value pair in the store.
- `get(key: string): Promise<KVStoreValue | null>`: Retrieves the value associated with the specified key.
- `delete(key: string): Promise<void>`: Deletes the key-value pair associated with the specified key.
- `list(): Promise<{ key: string; value: KVStoreValue }[]>`: Returns an array of all key-value pairs in the store.
- `clear(): Promise<void>`: Clears all key-value pairs from the store.
- `batchSet(entries: { key: string; value: KVStoreValue }[]): Promise<void>`: Sets multiple key-value pairs in the store.
- `batchDelete(keys: string[]): Promise<void>`: Deletes multiple key-value pairs from the store.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
