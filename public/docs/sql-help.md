# SQL Help
SQL commands are a standardized set of instructions used to interact with a relational database. They are broadly categorized into five main types, each serving a distinct purpose in database management. 

---

## Types and Key Commands

| Category | Purpose | Key Commands |
|---------|--------|-------------|
| DDL (Data Definition Language) | Define and modify the database structure/schema. | ```sql CREATE, ALTER, DROP, TRUNCATE, RENAME ``` |
| DML (Data Manipulation Language) | Manipulate the data stored within the tables. | ```sql INSERT, UPDATE, DELETE ``` |
| DQL (Data Query Language) | Fetch and retrieve data from the database. | ```sql SELECT ``` |
| DCL (Data Control Language) | Control access, permissions, and rights to the database. | ```sql GRANT, REVOKE ``` |
| TCL (Transaction Control Language) | Manage transactions and ensure data integrity. | ```sql COMMIT, ROLLBACK, SAVEPOINT ``` |

---

## Common SQL Commands with Examples
Here are some of the most frequently used SQL commands, with basic syntax examples:

### SELECT: Extracts data from a database.

```sql
SELECT column1, column2 FROM table_name WHERE condition;
```
(Use * to select all columns: SELECT * FROM table_name;)

---

### INSERT INTO: Inserts new data into a table.

```sql
INSERT INTO table_name (column1, column2) VALUES (value1, value2);
```

---

### UPDATE: Modifies existing data within a table.

```sql
UPDATE table_name SET column1 = value1, column2 = value2 WHERE condition;
```

---

### DELETE: Removes records from a table.

```sql
DELETE FROM table_name WHERE condition;
```

---

### CREATE TABLE: Creates a new table in the database.

```sql
CREATE TABLE table_name (
    column1 datatype,
    column2 datatype,
    ...
);
```

---

### ALTER TABLE: Modifies the structure of an existing table, for example, by adding a column.

```sql
ALTER TABLE table_name ADD column_name datatype;
```

---

### DROP TABLE: Deletes an entire table and all its data and structure permanently.

```sql
DROP TABLE table_name;
```

---

### GRANT: Gives specific privileges to a user.

```sql
GRANT SELECT, INSERT ON table_name TO user_name;
```

---

### COMMIT: Permanently saves the work done within the current transaction.

```sql
COMMIT;
``` 