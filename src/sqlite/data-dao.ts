import { db } from "./client";

export interface Data {
  uuid?: number;
  content: string;
  complete: number;
}

export async function createData(data: Data): Promise<Data | undefined> {
  // TODO: add validations
  const sql = `INSERT INTO data(content)
                VALUES(?,?)`;
  try {
    db.run(sql, [data.content, 0]); // insert data (0 means false on complete status)
    return data;
  } catch (error) {
    console.error("Error occurred during JSON parsing:", error);
    return undefined;
  }
}

export async function updateData(data: Data): Promise<Data | undefined> {
  const sql = `UPDATE data SET content = ${data.content} complete=${data.complete} WHERE uuid = ${data.uuid}`;
  // TODO: Add input validation
  try {
    db.run(sql);
    return data;
  } catch (error) {
    console.error("Error occurred during JSON parsing:", error);
    return undefined;
  }
}

export async function deleteData(uuid: Data["uuid"]): Promise<void> {
  const sql = `DELETE FROM data WHERE uuid = ${uuid}`;
  try {
    db.run(sql);
  } catch (error) {
    console.error("Error occurred during JSON parsing:", error);
  }
}

export async function getDataById(
  uuid: Data["uuid"]
): Promise<Data | undefined> {
  // TODO: Add input validation
  const sql = `SELECT * FROM data WHERE uuid = ${uuid}`;

  return new Promise<Data | undefined>((resolve, reject) => {
    db.all(sql, [], (err: any, row: Data) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

export async function getAllData(): Promise<Data[] | undefined> {
  // TODO: Add input validation
  const sql = `SELECT * FROM data`;
  return new Promise<Data[] | undefined>((resolve, reject) => {
    db.all(sql, [], (err: any, rows: Data[]) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// do complete & incomplete todo