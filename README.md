# Oracle SQL API Documentation

A RESTful API for managing various entities in an Oracle SQL database.

## Table of Contents
- [Setup](#setup)
- [Endpoints](#endpoints)
  - [Commands](#commands)
  - [Code Snippets](#code-snippets)
  - [Marks](#marks)
  - [Documents](#documents)
  - [Concepts](#concepts)

## Setup

### Prerequisites
- Oracle SQL Database
- Node.js (with Express.js)

### Database Tables
Run these SQL commands to create required tables:

```sql
-- Commands table
CREATE TABLE Command (
  id NUMBER GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(150),
  command VARCHAR(200),
  created VARCHAR(100)
);

-- Code table
CREATE TABLE Code (
  id NUMBER GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(150),
  url VARCHAR(200),
  created VARCHAR(100)
);

-- Marks table
CREATE TABLE Mark (
  id NUMBER GENERATED ALWAYS AS IDENTITY,
  document_id NUMBER,
  search_ VARCHAR(200),
  page NUMBER,
  created VARCHAR(100)
);

-- Documents table
CREATE TABLE Document (
  id NUMBER GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(150),
  url VARCHAR(200),
  created VARCHAR(100)
);

-- Concepts table (structure not provided in code)
```

## Endpoints

### Commands
Manage command entries

| Method | Endpoint                | Description                     | Request Body          | Returns                          |
|--------|-------------------------|---------------------------------|-----------------------|----------------------------------|
| POST   | `/commands`             | Create new command              | `{ title, command }`  | Created command object           |
| GET    | `/commands`             | Get all commands                | -                     | Array of command objects        |
| GET    | `/commands/filter/:search` | Search commands by title      | -                     | Filtered array of command objects|
| GET    | `/commands/:id`         | Get command by ID               | -                     | Single command object           |
| DELETE | `/commands/:id`         | Delete command by ID            | -                     | Success message                  |

**Command Object Structure:**
```json
{
  "ID": "",
  "TITLE": "",
  "COMMAND": "",
  "CREATED": ""
}
```

### Code Snippets
Manage code snippets

| Method | Endpoint                | Description                     | Request Body          | Returns                          |
|--------|-------------------------|---------------------------------|-----------------------|----------------------------------|
| POST   | `/codes`                | Create new code snippet         | `{ title, url }`      | Created code object              |
| GET    | `/codes`                | Get all code snippets           | -                     | Array of code objects           |
| GET    | `/codes/filter/:search`| Search code by title            | -                     | Filtered array of code objects  |
| GET    | `/codes/:id`            | Get code by ID                  | -                     | Single code object               |
| DELETE | `/codes/:id`            | Delete code by ID               | -                     | Success message                  |

**Code Object Structure:**
```json
{
  "ID": "",
  "TITLE": "",
  "URL": "",
  "CREATED": ""
}
```
![alt text](https://github.com/abdelouahedlabrigui/resource-bookmarks/blob/nodejs_backend/imgs/Document.png?raw=true)

### Marks
Manage document marks

| Method | Endpoint                | Description                     | Request Body                | Returns                          |
|--------|-------------------------|---------------------------------|-----------------------------|----------------------------------|
| POST   | `/marks`                | Create new mark                 | `{ document_id, search_, page }` | Created mark object       |
| GET    | `/marks`                | Get all marks                   | -                           | Array of mark objects           |
| GET    | `/marks/:id`            | Get mark by ID                  | -                           | Single mark object               |
| GET    | `/marks/filter/:document_id` | Get marks by document ID  | -                           | Filtered array of mark objects  |
| DELETE | `/marks/:id`            | Delete mark by ID               | -                           | Success message                  |

**Mark Object Structure:**
```json
{
  "ID": "",
  "DOCUMENT_ID": "",
  "SEARCH_": "",
  "PAGE": "",
  "CREATED": ""
}
```

### Documents
Manage documents

| Method | Endpoint                | Description                     | Request Body          | Returns                          |
|--------|-------------------------|---------------------------------|-----------------------|----------------------------------|
| POST   | `/documents`            | Create new document             | `{ title, url }`      | Created document object          |
| GET    | `/documents`            | Get all documents               | -                     | Array of document objects       |
| GET    | `/documents/filter/:search` | Search documents by title    | -                     | Filtered array of document objects |
| GET    | `/documents/:id`        | Get document by ID              | -                     | Single document object          |
| DELETE | `/documents/:id`        | Delete document by ID           | -                     | Success message                  |

**Document Object Structure:**
```json
{
  "ID": "",
  "TITLE": "",
  "URL": "",
  "CREATED": ""
}
```

### Concepts
Manage concepts

| Method | Endpoint                | Description                     | Request Body          | Returns                          |
|--------|-------------------------|---------------------------------|-----------------------|----------------------------------|
| POST   | `/concepts`             | Create new concept              | `{ science, token }`  | Created concept object           |
| GET    | `/concepts`             | Get all concepts                | -                     | Array of concept objects        |
| GET    | `/concepts/filter/:search` | Search concepts by term      | -                     | Filtered array of concept objects|
| GET    | `/concepts/:id`         | Get concept by ID               | -                     | Single concept object           |
| PUT    | `/concepts/:id`         | Update concept by ID           | Updated concept data  | Updated concept object           |
| DELETE | `/concepts/:id`         | Delete concept by ID            | -                     | Success message                  |

**Concept Object Structure:**
```json
{
  "ID": "",
  "SCIENCE": "",
  "TOKEN": "",
  "DEFINITION_": "",
  "CREATED": ""
}
```

## Usage
1. Set up your Oracle SQL database with the provided schema
2. Configure your environment variables with database credentials
3. Start the server
4. Use the endpoints as documented above
