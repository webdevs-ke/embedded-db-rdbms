### IndexedDB
IndexedDB is a high-performance, client-side NoSQL storage system built into modern web browsers. It is designed for storing large amounts of structured data, including files and blobs, making it a critical tool for Progressive Web Apps (PWAs) and offline-first applications. 

---

#### Core Characteristics
1. NoSQL Database: It stores data as JavaScript objects rather than in fixed-column tables.
2. Transactional: All read and write operations must occur within a transaction, ensuring data integrity.
3. Asynchronous: Operations do not block the main UI thread, though they use an older event-based model rather than modern Promises.
4. High Capacity: Unlike the 5-10MB limit of LocalStorage, IndexedDB can typically store hundreds of megabytes or even gigabytes, depending on the browser and available disk space.
5. Same-Origin Policy: Data is strictly isolated by origin (protocol, domain, and port), meaning one website cannot access the database of another. 

---

#### Key Components
1. Object Stores: Equivalent to tables in SQL; they hold records which are key-value pairs.
2. Indexes: Specialized object stores used to look up records by properties other than the primary key (e.g., searching for a user by "email" instead of "ID").
3. Cursors: Objects used to iterate over multiple records in an object store or index one by one to save memory.
4. Versioning: IndexedDB includes built-in schema versioning. Structural changes (like creating a new store) can only be performed during an upgradeneeded event triggered by incrementing the version number. 

---

#### Popular Wrapper Libraries
Because the native API is verbose and event-based, most developers use modern wrappers: 
* idb: A small, promise-based wrapper that allows using async/await with IndexedDB.
* Dexie.js: A robust library that provides a more fluent, developer-friendly API and advanced features like multi-tab synchronization.
* localForage: A simple library that uses IndexedDB by default but falls back to LocalStorage or WebSQL if necessary. 

---

#### Standard Implementation Pattern
1. Open Database: Request a connection using indexedDB.open(name, version).
2. Upgrade Schema: If the version is new, create object stores and indexes in the onupgradeneeded handler.
3. Start Transaction: Create a transaction on one or more stores (modes: readonly or readwrite).
4. Execute Request: Perform an operation (e.g., add(), put(), or get()) and listen for onsuccess or onerror events. 
