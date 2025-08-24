import oracledb from "oracledb";
import { Request, Response } from "express";
// import axios from "axios";


export async function getConnection() {
  return await oracledb.getConnection({
    user: "SYS",
    password: "oracle",
    connectionString: "10.42.0.243/FREE",
    privilege: oracledb.SYSDBA
  });
}

export async function createMark(req: Request, res: Response) {
  const { document_id, search_, page } = req.body;

  try {
    const d = new Date();
    let created = d.toISOString();

    const conn = await getConnection();
    const result = await conn.execute(
      `INSERT INTO Mark (document_id, search_, page, created)
       VALUES (:document_id, :search_, :page, :created)
       RETURNING id INTO :id`,
      {
        document_id,
        search_,
        page,
        created,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    res.status(201).json({ id: (result.outBinds as { id: any[] }).id[0], document_id, search_, page, created });
    await conn.close();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

function isMarkRow(row: unknown): row is [number, number, string, number, string] {
  return (
    Array.isArray(row) &&
    typeof row[0] === "number" &&
    typeof row[1] === "number" &&
    typeof row[2] === "string" &&
    typeof row[3] === "number" &&
    typeof row[4] === "string"
  );
}

export async function getMarks(req: Request, res: Response) {
  try {
    const conn = await getConnection();
    const result = await conn.execute("SELECT id, document_id, search_, page, created FROM Mark ORDER BY TO_NUMBER(id) DESC FETCH FIRST 20 ROWS ONLY");
    const concepts = result.rows
      ?.filter(isMarkRow)
      .map((row) => ({
        ID: row[0],
        DOCUMENT_ID: row[1],
        SEARCH_: row[2],
        PAGE: row[3],
        CREATED: row[4]
      })) || [];
    res.json(concepts);
    await conn.close();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// READ by ID
export async function getMarkById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const conn = await getConnection();
    const result = await conn.execute("SELECT id, document_id, search_, page, created FROM Mark WHERE id = :id ", [id]);

    const concept = result.rows?.[0] && isMarkRow(result.rows[0]) ? {
      ID: result.rows[0][0],
      DOCUMENT_ID: result.rows[0][1],
      SEARCH_: result.rows[0][2],
      PAGE: result.rows[0][3],
      CREATED: result.rows[0][4]
    } : null;

    res.json(concept);
    await conn.close();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// SEARCH BY QUERY
export async function getMarkBySearch(req: Request, res: Response) {
  const { document_id } = req.params;

  if (!document_id) {
    return res.status(400).json({ error: 'Invalid search parameter' });
  }

  try {
    const conn = await getConnection();

    const result = await conn.execute(
      `SELECT id, document_id, search_, page, created
       FROM Mark
       WHERE document_id = :document_id 
        ORDER BY TO_NUMBER(id) DESC FETCH FIRST 20 ROWS ONLY
        `,
      {
        document_id: document_id
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      }
    );

    const concepts = result.rows || [];

    if (!concepts.length) {
      return res.status(404).json({ message: 'No Marks found' });
    }

    res.json(concepts);
    await conn.close();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE
export async function deleteMark(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const conn = await getConnection();
    await conn.execute("DELETE FROM Mark WHERE id = :id", [id], { autoCommit: true });
    res.json({ message: `Mark ${id} deleted` });
    await conn.close();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}