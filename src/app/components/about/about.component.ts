import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  topic!: string

  contentMap: Record<string, { title: string; body: string }> = {
    ngdb: {
      title: 'About ngDB RDBMS',
      body: "A lightweight, client-side relational database engine for Angular applications. It provides a SQL engine, IndexedDB persistence, and an optional built-in REPL console — all without a backend. It features * SQL-like syntax (CREATE, INSERT, SELECT, UPDATE, DELETE, ALTER, JOIN) * IndexedDB persistence (offline-first) * Angular-native services & DI * Optional SQL REPL console component * Multiple database support * Schema enforcement (PRIMARY KEY, UNIQUE) * Extendable (indexes, joins, file blobs, sessions) ## Core Concepts ### DatabaseService Manages databases, tables, persistence, and schema. ### SqlEngineService Executes SQL strings and returns structured results. ### SqlParser Converts SQL strings into AST (Abstract Syntax Tree).",
    },
    'sql-help': {
      title: 'Help with SQL Commands',
      body: 'Supported SQL includes SHOW DATABASES, USE DATABAE db_name, DROP DATABASE db_name, SELECT, INSERT, UPDATE, DELETE',
    },
    indexeddb: {
      title: 'About IndexedDB',
      body: 'IndexedDB is a high-performance, client-side NoSQL storage system built into modern web browsers. It is designed for storing large amounts of structured data, including files and blobs, making it a critical tool for Progressive Web Apps (PWAs) and offline-first applications. Core Caharacteristics: 1. NoSQL Database: It stores data as JavaScript objects rather than in fixed-column tables. 2. Transactional: All read and write operations must occur within a transaction, ensuring data integrity. 3. Asynchronous: Operations do not block the main UI thread, though they use an older event-based model rather than modern Promises. 4. High Capacity: Unlike the 5-10MB limit of LocalStorage, IndexedDB can typically store hundreds of megabytes or even gigabytes, depending on the browser and available disk space. 5. Same-Origin Policy: Data is strictly isolated by origin (protocol, domain, and port), meaning one website cannot access the database of another. Key Components: 1. Object Stores: Equivalent to tables in SQL; they hold records which are key-value pairs. 2. Indexes: Specialized object stores used to look up records by properties other than the primary key (e.g., searching for a user by "email" instead of "ID"). 3. Cursors: Objects used to iterate over multiple records in an object store or index one by one to save memory. 4. Versioning: IndexedDB includes built-in schema versioning. Structural changes (like creating a new store) can only be performed during an upgradeneeded event triggered by incrementing the version number. Standard Implementation Pattern 1. Open Database: Request a connection using indexedDB.open(name, version). 2. Upgrade Schema: If the version is new, create object stores and indexes in the onupgradeneeded handler. 3. Start Transaction: Create a transaction on one or more stores (modes: readonly or readwrite). 4. Execute Request: Perform an operation (e.g., add(), put(), or get()) and listen for onsuccess or onerror events.',
    },
    angular: {
      title: 'About Angular',
      body: 'Angular is a prominent open-source web application framework developed and maintained by Google. As of January 2026, it is a leading platform for building scalable, high-performance single-page applications (SPAs) using TypeScript. #### Core Characteristics 1. Component-Based Architecture: Applications are built as a hierarchy of modular components, which are classes that handle data logic and are associated with HTML templates. 2. TypeScript-Driven: It utilizes TypeScript to provide static typing, which helps catch errors during development and improves code maintainability. 3. Modern Reactivity: The framework recently introduced Signals, a system for fine-grained state management that optimizes rendering updates for better performance. 4. Comprehensive Toolset: Unlike libraries that focus only on the UI, Angular is "opinionated" and includes built-in solutions for: - Routing: Managing navigation between different views. - Forms: Tools for handling complex user input and validation. - HTTP Client: A robust system for communicating with backend servers. - Dependency Injection: A design pattern used to increase efficiency and modularity.',
    },
  }

  constructor(route: ActivatedRoute) {
    route.paramMap.subscribe(params => {
      this.topic = params.get('topic') ?? 'ngdb'
    })
  }

  get content() {
    return this.contentMap[this.topic]
  }
}