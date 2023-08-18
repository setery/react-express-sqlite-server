import { db } from "./client";

export interface Data {
  uuid?: number;
  content: string;
  complete: number;
}
export interface Current {
  completeToDos: Data[];
  incompleteToDos: Data[];
}

export async function createData(data: Data): Promise<Data | undefined> {
  // TODO: add validations
  console.log(data);
  const sql = `INSERT INTO data(content, complete) VALUES(?,?)`;
  try {
    db.run(sql, [data.content, 1]); // insert data (0 means false on complete status)
    return data;
  } catch (error) {
    console.error("Error occurred during JSON parsing:", error);
    return undefined;
  }
}
// update data
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

export async function getCurrentData(): Promise<Current> {
  // TODO: Add input validation
  const sqlComplete = `SELECT * FROM data WHERE complete = ?`;
  const sqlIncomplete = `SELECT * FROM data WHERE complete = ?`;
  let currentComplete: Data[] = [];
  let currentIncomplete: Data[] = [];

  return new Promise<Current>((resolve, reject) => {
    db.all(sqlIncomplete, [1], (err: any, rowsIncomplete: Data[]) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        if (rowsIncomplete) {
          currentIncomplete = rowsIncomplete;
        }
        db.all(sqlComplete, [0], (err: any, rowsComplete: Data[]) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            if (rowsComplete) {
              currentComplete = rowsComplete;
            }
            const current: Current = {
              completeToDos: currentComplete,
              incompleteToDos: currentIncomplete,
            };
            resolve(current);
          }
        });
      }
    });
  });
}
