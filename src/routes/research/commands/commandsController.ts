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

export async function createCommand(req: Request, res: Response) {
  const { title, command } = req.body;

  try {
    const d = new Date();
    let created = d.toISOString();

    const conn = await getConnection();
    const result = await conn.execute(
      `INSERT INTO Command (title, command, created)
       VALUES (:title, :command, :created)
       RETURNING id INTO :id`,
      {
        title,
        command,
        created,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    res.status(201).json({ id: (result.outBinds as { id: any[] }).id[0], title, command, created });
    await conn.close();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

function isCommandRow(row: unknown): row is [number, string, string, string] {
  return (
    Array.isArray(row) &&
    typeof row[0] === "number" &&
    typeof row[1] === "string" &&
    typeof row[2] === "string" &&
    typeof row[3] === "string"
  );
}

export async function getCommands(req: Request, res: Response) {
  try {
    const conn = await getConnection();
    const result = await conn.execute("SELECT id, title, command, created FROM Command ORDER BY  id DESC FETCH FIRST 20 ROWS ONLY");
    const concepts = result.rows
      ?.filter(isCommandRow)
      .map((row) => ({
        ID: row[0],
        TITLE: row[1],
        COMMAND: row[2],
        CREATED: row[3],
      })) || [];
    res.json(concepts);
    await conn.close();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// READ by ID
export async function getCommandById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const conn = await getConnection();
    const result = await conn.execute("SELECT id, title, command, created FROM Command WHERE id = :id ", [id]);

    const concept = result.rows?.[0] && isCommandRow(result.rows[0]) ? {
      ID: result.rows[0][0],
      TITLE: result.rows[0][1],
      COMMAND: result.rows[0][2],
      CREATED: result.rows[0][3]
    } : null;

    res.json(concept);
    await conn.close();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// SEARCH BY QUERY
export async function getCommandBySearch(req: Request, res: Response) {
  const { search } = req.params;

  if (!search || typeof search !== 'string') {
    return res.status(400).json({ error: 'Invalid search parameter' });
  }

  try {
    const conn = await getConnection();

    const result = await conn.execute(
      `SELECT id, title, command, created
       FROM Command 
       WHERE LOWER(title) LIKE LOWER(:searchPattern) ESCAPE '\\'
        ORDER BY id DESC FETCH FIRST 20 ROWS ONLY`,
      {
        searchPattern: `%${search.replace(/%/g, '\\%')}%`
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      }
    );

    const concepts = result.rows || [];

    if (!concepts.length) {
      return res.status(404).json({ message: 'No Commands found' });
    }

    res.json(concepts);
    await conn.close();
  } catch (err: any) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE
export async function deleteCommand(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const conn = await getConnection();
    await conn.execute("DELETE FROM Command WHERE id = :id", [id], { autoCommit: true });
    res.json({ message: `Command ${id} deleted` });
    await conn.close();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}