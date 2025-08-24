// db.ts
import oracledb from "oracledb";
import { Request, Response } from "express";
import axios from "axios";
import ollama from 'ollama'


export async function getConnection() {
  return await oracledb.getConnection({
    user: "SYS",
    password: "oracle",
    connectionString: "10.42.0.243/FREE",
    privilege: oracledb.SYSDBA
  });
}

export async function createConcept(req: Request, res: Response) {
  const { science, token } = req.body;

  try {
    // Prompt Ollama phi3:latest
    const ollamaRes = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "phi3:latest",
        prompt: `Please provide a concise, technical, and scientific definition 
            for the term '${token}' within the field of '${science}'. 
            Keep the response to a single paragraph. Do not include introductory phrases like 'A scientific definition of...'`
      },
      { responseType: "json" }
    );
    const response = await ollama.chat({
      model: 'phi3:latest',
      messages: [{ role: 'user', content: `Please provide a concise, technical, and scientific definition 
            for the term '${token}' within the field of '${science}'. 
            Keep the response to a single paragraph. Do not include introductory phrases like 'A scientific definition of...'` }],
    })

    // Ollama streams responses line-by-line, but axios collects the body.
    // Response may look like { response: "text...", done: true }
    const definition_ = response.message.content;
    const created = new Date().toISOString();

    // Insert into Oracle
    const conn = await getConnection();
    const result = await conn.execute(
      `INSERT INTO Concept (science, token, definition_, created)
       VALUES (:science, :token, :definition_, :created)
       RETURNING id INTO :id`,
      {
        science,
        token,
        definition_,
        created,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    const newId = (result.outBinds as { id: any[] }).id[0];
    res.status(201).json({ id: newId, science, token, definition_, created });
    await conn.close();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}


function isConceptRow(row: unknown): row is [number, string, string, string, string] {
  return (
    Array.isArray(row) &&
    typeof row[0] === "number" &&
    typeof row[1] === "string" &&
    typeof row[2] === "string" &&
    typeof row[3] === "string" &&
    typeof row[4] === "string"
  );
}

// READ ALL
export async function getConcepts(req: Request, res: Response) {
  try {
    const conn = await getConnection();
    const result = await conn.execute("SELECT id, science, token, definition_, created FROM Concept ORDER BY id DESC FETCH FIRST 20 ROWS ONLY");
    const concepts = result.rows
      ?.filter(isConceptRow)
      .map((row) => ({
        ID: row[0],
        SCIENCE: row[1],
        TOKEN: row[2],
        DEFINITION_: row[3],
        CREATED: row[4],
      })) || [];
    res.json(concepts);
    await conn.close();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
interface ConceptRow {
  id: number;
  science: string;
  token: string;
  definition_: string;
  created: string;
}
// READ by ID
export async function getConceptById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const conn = await getConnection();
    const result = await conn.execute("SELECT id, science, token, definition_, created FROM Concept WHERE id = :id ", [id]);

    const concept = result.rows?.[0] && isConceptRow(result.rows[0]) ? {
      ID: result.rows[0][0],
      SCIENCE: result.rows[0][1],
      TOKEN: result.rows[0][2],
      DEFINITION_: result.rows[0][3],  // Note: using 'definition' instead of 'definition_'
      CREATED: result.rows[0][4]
    } : null;

    res.json(concept);
    await conn.close();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// SEARCH BY QUERY
export async function getConceptBySearch(req: Request, res: Response) {
  const { search } = req.params;

  if (!search || typeof search !== 'string') {
    return res.status(400).json({ error: 'Invalid search parameter' });
  }

  try {
    const conn = await getConnection();

    const result = await conn.execute(
      `SELECT id, science, token, definition_, created
       FROM Concept
       WHERE LOWER(token) LIKE LOWER(:searchPattern) ESCAPE '\\' 
          OR LOWER(definition_) LIKE LOWER(:searchPattern)  ESCAPE '\\'  
        ORDER BY id DESC FETCH FIRST 20 ROWS ONLY
        `,
      {
        searchPattern: `%${search.replace(/%/g, '\\%')}%`
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      }
    );

    const concepts = result.rows || [];

    if (!concepts.length) {
      return res.status(404).json({ message: 'No concepts found' });
    }

    res.json(concepts);
    await conn.close();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// UPDATE
export async function updateConcept(req: Request, res: Response) {
  const { id } = req.params;
  const { science, token } = req.body;

  try {
    // Optionally re-fetch definition
    const response = await axios.get("http://10.42.0.243:5000/generate-definition", {
      params: { science, token }
    });
    const { definition_, created } = response.data;

    const conn = await getConnection();
    await conn.execute(
      `UPDATE Concept
       SET science = :science, token = :token, definition_ = :definition_, created = :created
       WHERE id = :id`,
      { id, science, token, definition_, created },
      { autoCommit: true }
    );

    res.json({ id, science, token, definition_, created });
    await conn.close();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE
export async function deleteConcept(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const conn = await getConnection();
    await conn.execute("DELETE FROM Concept WHERE id = :id", [id], { autoCommit: true });
    res.json({ message: `Concept ${id} deleted` });
    await conn.close();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}