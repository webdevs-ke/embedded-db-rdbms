# ngDB - Angular Embedded RDBMS

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

### DatabaseService

Manages databases, tables, persistence, and schema.

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

---

## Tech Stack

### IndexedDB
IndexedDB is a high-performance, client-side NoSQL storage system built into modern web browsers. It is designed for storing large amounts of structured data, including files and blobs, making it a critical tool for Progressive Web Apps (PWAs) and offline-first applications. 

#### Core Characteristics
1. NoSQL Database: It stores data as JavaScript objects rather than in fixed-column tables.
2. Transactional: All read and write operations must occur within a transaction, ensuring data integrity.
3. Asynchronous: Operations do not block the main UI thread, though they use an older event-based model rather than modern Promises.
4. High Capacity: Unlike the 5-10MB limit of LocalStorage, IndexedDB can typically store hundreds of megabytes or even gigabytes, depending on the browser and available disk space.
5. Same-Origin Policy: Data is strictly isolated by origin (protocol, domain, and port), meaning one website cannot access the database of another. 

#### Key Components
1. Object Stores: Equivalent to tables in SQL; they hold records which are key-value pairs.
2. Indexes: Specialized object stores used to look up records by properties other than the primary key (e.g., searching for a user by "email" instead of "ID").
3. Cursors: Objects used to iterate over multiple records in an object store or index one by one to save memory.
4. Versioning: IndexedDB includes built-in schema versioning. Structural changes (like creating a new store) can only be performed during an upgradeneeded event triggered by incrementing the version number. 

#### Popular Wrapper Libraries
Because the native API is verbose and event-based, most developers use modern wrappers: 
* idb: A small, promise-based wrapper that allows using async/await with IndexedDB.
* Dexie.js: A robust library that provides a more fluent, developer-friendly API and advanced features like multi-tab synchronization.
* localForage: A simple library that uses IndexedDB by default but falls back to LocalStorage or WebSQL if necessary. 

#### Standard Implementation Pattern
1. Open Database: Request a connection using indexedDB.open(name, version).
2. Upgrade Schema: If the version is new, create object stores and indexes in the onupgradeneeded handler.
3. Start Transaction: Create a transaction on one or more stores (modes: readonly or readwrite).
4. Execute Request: Perform an operation (e.g., add(), put(), or get()) and listen for onsuccess or onerror events. 

### Angular
Angular is a prominent open-source web application framework developed and maintained by Google. As of January 2026, it is a leading platform for building scalable, high-performance single-page applications (SPAs) using TypeScript. 

#### Core Characteristics
1. Component-Based Architecture: Applications are built as a hierarchy of modular components, which are classes that handle data logic and are associated with HTML templates.
2. TypeScript-Driven: It utilizes TypeScript to provide static typing, which helps catch errors during development and improves code maintainability.
3. Modern Reactivity: The framework recently introduced Signals, a system for fine-grained state management that optimizes rendering updates for better performance.
4. Comprehensive Toolset: Unlike libraries that focus only on the UI, Angular is "opinionated" and includes built-in solutions for:
    - Routing: Managing navigation between different views.
    - Forms: Tools for handling complex user input and validation.
    - HTTP Client: A robust system for communicating with backend servers.
    - Dependency Injection: A design pattern used to increase efficiency and modularity. 

#### Recent Developments (2025–2026)
Angular v21: Released in early 2026, this version introduced Signal Forms, enhanced AI-powered workflows via the Angular MCP Server, and expanded support for spread operators in templates.
1. AI Integration: The framework now emphasizes "agentic workflows," allowing developers to use tool calling APIs to integrate Large Language Models (LLMs) directly into their web apps.
2. Standalone APIs: Modern versions have shifted away from "NgModules" in favor of standalone components, simplifying the initial learning curve and reducing boilerplate code. 

#### Getting Started
To begin developing with Angular, you typically need to install Node.js and the Angular CLI, which is the command-line tool used to create, build, and test applications. Official documentation and interactive tutorials can be found at https://angular.dev

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.8.

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

To get the code, clone the repository URL into your drive. Make sure you have git installed. You can also download a zip file of the project using the GitHub UI.

Open the project in VS Code or your favorite editor - IDE

# Development Environment - Node.js, npm, Angular CLI

You should have Angular installed after you have installed Node.js (contains npm).
Once your development environment is set up, you can run the app on your machine

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.


#### The project is still under development. Feel free to contribute your ideas
### LIVE DEMO - https://ngrdbms.netlify.app

##### Created by Bernard Katiku Mutua - katikumut@gmail.com - https://benkatiku.netlify.app - https://linkedin.com/in/katiku-mutua