/**
 *  backend/server.ts
 *
 *  Minimal Express API that:
 *   * Reads :date query param (YYYY‑MM‑DD)
 *   * Searches the `news_api_articles` table for rows whose `publishedAt`
 *     contains that string.
 *   * Returns a JSON array.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import oracledb from "oracledb";
import { Router, Request, Response } from 'express';
import bodyParser from "body-parser";
import axios from "axios";
import {
  createConcept,
  getConcepts,
  getConceptById,
  getConceptBySearch,
  updateConcept,
  deleteConcept
} from "./research/concepts/conceptController.js";
import {
  createDocument,
  getDocuments,
  getDocumentById,
  getDocumentBySearch,
  deleteDocument
} from "./research/documents/documentController.js";
import {
  createMark,
  getMarks,
  getMarkById,
  getMarkBySearch,
  deleteMark
} from "./research/marks/markController.js";
import {
  createCode,
  getCodes,
  getCodeById,
  getCodeBySearch,
  deleteCode
} from "./research/codes/codesController.js";
import {
  createCommand,
  getCommands,
  getCommandById,
  getCommandBySearch,
  deleteCommand
} from "./research/commands/commandsController.js";

dotenv.config();
const router = Router();
/** ----------------------------------------------------------------------- */
/*  Oracle client – required only once on startup. */
// oracledb.initOracleClient({
//   libDir: process.env.ORACLE_CLIENT_LIB_DIR,
// });

/** ----------------------------------------------------------------------- */
/*  Express boilerplate. */
const app = express();
// app.use(cors({ origin: '*' }));   // or more strict origin
app.use(express.json());                 // JSON body parsing (if you add POST later)
app.use(bodyParser.json())

/** ----------------------------------------------------------------------- */
/*  DB connection config – loaded from .env */
const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  privilege: oracledb.SYSDBA,
  connectString: process.env.ORACLE_CONNECTION_STRING,
};

/**
 * Requires Oracle SQL Database
 * user, password, connectionString
 */
/**Commands */
/**
 * CREATE QUERY: 
 * CREATE TABLE Command (
          id NUMBER GENERATED ALWAYS AS IDENTITY,
          title VARCHAR(150),
          command VARCHAR(200),
          created VARCHAR(100)
  );
 */
/**POST: { title, command } */
/**
 * RETURNS: [{"ID": "", "TITLE": "", "COMMAND": "", "CREATED": ""}]
 */
router.post("/commands", createCommand);
router.get("/commands", getCommands);
router.get("/commands/filter/:search", getCommandBySearch);
router.get("/commands/:id", getCommandById);
router.delete("/commands/:id", deleteCommand);

/**Code */
/**
 * CREATE QUERY: 
 * CREATE TABLE Code (
          id NUMBER GENERATED ALWAYS AS IDENTITY,
          title VARCHAR(150),
          url VARCHAR(200),
          created VARCHAR(100)
  );
 */
/**POST: { title, url } */
router.post("/codes", createCode);
router.get("/codes", getCodes);
/**
 * RETURNS: [{"ID": "", "TITLE": "", "URL": "", "CREATED": ""}]
 */
router.get("/codes/filter/:search", getCodeBySearch);
router.get("/codes/:id", getCodeById);
router.delete("/codes/:id", deleteCode);

/**Marks */
/**
 * CREATE QUERY: 
 * CREATE TABLE Mark (
          id NUMBER GENERATED ALWAYS AS IDENTITY,
          document_id NUMBER,
          search_ VARCHAR(200),
          page NUMBER,
          created VARCHAR(100)
  );
 */
/**POST: { document_id, search_, page } */
router.post("/marks", createMark);
router.get("/marks", getMarks);
/**
 * RETURNS: [{"ID": "", "DOCUMENT_ID": "", "SEARCH_": "", "PAGE": "", "CREATED": ""}]
 */
router.get("/marks/:id", getMarkById);
router.get('/marks/filter/:document_id', getMarkBySearch);
router.delete("/marks/:id", deleteMark);

/**Documents */
/**
 * CREATE QUERY: 
 * CREATE TABLE Document (
          id NUMBER GENERATED ALWAYS AS IDENTITY,
          title VARCHAR(150),
          url VARCHAR(200),
          created VARCHAR(100) 
  );
 */
/**POST: { title, url } */
router.post("/documents", createDocument);
router.get("/documents", getDocuments);
/**
 * RETURNS: [{"ID": "", "TITLE": "", "URL": "", "CREATED": ""}]
 */
router.get("/documents/:id", getDocumentById);
router.get('/documents/filter/:search', getDocumentBySearch);
router.delete("/documents/:id", deleteDocument);

/**Concepts */
/**
 * CREATE QUERY: 
 * 
 */
/**POST: { science, token } */
router.post("/concepts", createConcept);
router.get("/concepts", getConcepts);
/**
 * RETURNS: [{"ID": "", "SCIENCE": "", "TOKEN": "", "DEFINITION_": "", "CREATED": ""}]
 */
router.get("/concepts/:id", getConceptById);
router.get('/concepts/filter/:search', getConceptBySearch);
router.put("/concepts/:id", updateConcept);
router.delete("/concepts/:id", deleteConcept);


/** ----------------------------------------------------------------------- */
// const PORT = process.env.PORT ?? 4000;
// app.listen(PORT, () => {
//   console.log(`✅ News API listening on http://localhost:${PORT}`);
// });
export default router;