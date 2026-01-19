# Angular Embedded RDBMS

A lightweight, client-side relational database engine for Angular applications. It provides a SQL engine, IndexedDB persistence, and an optional built-in REPL console — all without a backend.

---

## ✨ Features

* SQL-like syntax (CREATE, INSERT, SELECT, UPDATE, DELETE, ALTER, JOIN)
* IndexedDB persistence (offline-first)
* Angular-native services & DI
* Optional SQL REPL console component
* Multiple database support
* Schema enforcement (PRIMARY KEY, UNIQUE)
* Extendable (indexes, joins, file blobs, sessions)

---

## Core Concepts

### IndexedDbService

Provides APIs to interact with the browser-based storage, IndexedDB, and allows opening of data stores, creating, saving, and deleting of DB tables as well as iterating over the data store's key-value pairs. It basically interfaces to IndexedDB's persistence ability.

### DatabaseService

Manages databases, tables, schema, and persistence to IndexedDB via the IndexedDbService layer.

### SqlEngineService

Executes SQL strings and returns structured results.

### SqlParser

Converts SQL strings into AST (Abstract Syntax Tree).

---

## 🧪 Example 1: Creating Tables

```ts
await sql.execute(`
  CREATE TABLE users (
    id INT PRIMARY,
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT
  )
`)

await sql.execute(`
  CREATE TABLE books (
    id INT PRIMARY,
    title TEXT,
    type_id INT
  )
`)
```

---

## 🧪 Example 2: Inserting Data

```ts
await sql.execute(`
  INSERT INTO users VALUES (1, 'Alice', 'alice@mail.com', '1234')
`)

await sql.execute(`
  INSERT INTO books VALUES (1, 'Clean Code', 1)
`)
```

---

## 🧪 Example 3: Selecting Data

```ts
const users = await sql.execute(`
  SELECT * FROM users
`)
```

With WHERE:

```ts
SELECT * FROM users WHERE email='alice@mail.com'
```

---

## 🧪 Example 4: JOIN Query

```sql
SELECT users.name, books.title
FROM users
JOIN books ON users.id = books.user_id
```

---

## 🧪 Example 5: UPDATE & DELETE

```sql
UPDATE users SET phone='5678' WHERE id=1
DELETE FROM users WHERE id=1
```

---

## 🧪 Example 6: ALTER TABLE

```sql
ALTER TABLE users ADD COLUMN age INT
ALTER TABLE users RENAME COLUMN phone TO mobile
ALTER TABLE users DROP COLUMN age
ALTER TABLE users RENAME TO customers
```

---

## 🧪 Example 7: SHOW Commands

```sql
SHOW DATABASES
SHOW TABLES
```

---

## 🖥️ REPL Console Component

A built-in SQL console within the app:

Features:

* SQL input
* Execute / clear
* Result viewer
* Error messages
* History

---

## 💾 Persistence

All data is persisted automatically to IndexedDB. Data survives page reloads and browser restarts.

---

## 📁 Storing Files (PDFs, Blobs)

Use `BLOB` or `FILE` column types internally backed by IndexedDB `Blob` objects.

```sql
ALTER TABLE books ADD COLUMN file BLOB
```

---

## 🔐 Sessions & Auth (Example)

```sql
SELECT * FROM users WHERE email=? AND phone=?
```

Persist session state using LocalStorage or a `sessions` table.

---

## 🧩 Programmatic API

```ts
const db = databaseService.table('users')
db.insert({ id: 2, name: 'Bob', email: 'bob@mail.com' })
```

---

## 🧪 Testing & Debugging

* Use REPL for schema inspection
* Enable SQL logging in SqlEngineService
* Clear IndexedDB via dev tools if needed

---

## 🚀 Roadmap

* Query planner & optimizer
* Indexes (B-tree / hash)
* Transactions
* SQL views
* WASM backend option

---

## 📄 License

MIT License
