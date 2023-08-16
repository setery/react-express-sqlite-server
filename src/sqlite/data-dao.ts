import { db } from "./client";

export interface Data {
  uuid: number;
  content: string;
}

export async function createData(data: Data): Promise<Data | undefined> {
  // TODO: add validations
  const sql = `INSERT INTO data(content)
                VALUES(?)`;
  try {
    db.run(sql, [data.content]); // insert data
    return data;
  } catch (error) {
    console.error("Error occurred during JSON parsing:", error);
    return undefined;
  }
}

export async function updateData(data: Data): Promise<Data | undefined> {
  const sql = `UPDATE data SET content = ${data.content} WHERE uuid = ${data.uuid}`;
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
  const sql = `DELETE FROM data WHERE uuid = ${uuid}`;
  try {
    const result = db.all(sql, [], (err: any, rows: any) => {
      if (err) {
        return console.error(err.message);
      }
    });
    return result as unknown as Data;
  } catch (error) {
    console.error("Error occurred during JSON parsing:", error);
    return undefined;
  }
}

export async function getAllData(): Promise<Data[] | undefined> {
  // TODO: Add input validation
  const sql = `SELECT * FROM data`;
  try {
    db.all(sql, [], (err: any, rows: Data[]) => {
      if (err) {
        return console.error(err.message);
      }
      return rows;
    });
  } catch (error) {
    return Promise.reject("Error occurred during JSON parsing: " + error);
  }
}
