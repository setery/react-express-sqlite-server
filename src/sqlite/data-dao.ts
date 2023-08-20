import { db } from "./client";
import { User } from "./user-dao";

export interface Data {
  uuid?: number;
  user_uuid?: number;
  content: string;
  complete: number;
}
export interface Current {
  completeToDos: Data[];
  incompleteToDos: Data[];
}

export async function createData(data: Data, user_uuid: User["uuid"]): Promise<Data | undefined> {
  // TODO: add validations
  const sql = `INSERT INTO data(user_uuid, content, complete) VALUES(?,?,?);
  SELECT last_insert_row`;
  return new Promise<Data>((resolve, reject) => {
    db.run(sql, [user_uuid, data.content, 0]); // insert data (0 means false on complete status)
    db.get("SELECT last_insert_rowid() as uuid", (err: any, lastInsertedRow: Data)=>{
      if(err){
        reject(err)
      } else{
        data.uuid = lastInsertedRow.uuid;
        data.user_uuid = user_uuid;
        resolve(data)
      }
    });
  })
}

export async function updateData(data: Data, user_uuid: User["uuid"]): Promise<Data | undefined> {
  const sqlSearch = `SELECT * FROM data WHERE uuid = ? AND user_uuid = ?`;

  const sqlUpdate = `UPDATE data SET content = ? complete = ? WHERE uuid = ? AND user_uuid = ?`;

  // TODO: Add input validation
  return new Promise<Data>((resolve, reject) => {
    db.all(sqlSearch, [data.uuid, user_uuid], (err: any, row: Data[]) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        if (row[0]) {
          db.run(sqlUpdate, [data.content, data.complete, data.uuid, user_uuid]).catch(
            (error: any) => {
              reject(error);
            }
          );
          resolve(data);
        }
      }
    });
  });
}

export async function updateDataToComplete(
  data: Data, user_uuid: User["uuid"]
): Promise<Data | undefined> {
  const sqlSearch = `SELECT * FROM data WHERE uuid = ? AND user_uuid = ?`;
  const sqlUpdate = `UPDATE data SET complete = ? WHERE uuid = ? AND user_uuid = ?`;

  // TODO: Add input validation
  return new Promise<Data>((resolve, reject) => {
    db.all(sqlSearch, [data.uuid, user_uuid], (err: any, row: Data[]) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        if (!row[0]) {
          reject("Could not find ToDo");
        }
        if (row[0].complete) {
          reject("ToDo is already complete");
        }
        db.run(sqlUpdate, [1, data.uuid, user_uuid]);
        data.content = row[0].content;
        data.complete = 1;
        data.user_uuid = row[0].user_uuid;
        resolve(data);
      }
    });
  });
}
export async function updateDataToIncomplete(
  data: Data, user_uuid: User["uuid"]
): Promise<Data | undefined> {
  const sqlSearch = `SELECT * FROM data WHERE uuid = ? AND user_uuid = ?`;
  const sqlUpdate = `UPDATE data SET complete = ? WHERE uuid = ? AND user_uuid = ?`;

  // TODO: Add input validation
  return new Promise<Data>((resolve, reject) => {
    db.all(sqlSearch, [data.uuid, user_uuid], (err: any, row: Data[]) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        if (!row[0]) {
          reject("Could not find ToDo");
        }
        if (!row[0].complete) {
          reject("ToDo is already complete");
        }
        db.run(sqlUpdate, [0, data.uuid, user_uuid]);
        data.content = row[0].content;
        data.complete = 0;
        data.user_uuid = row[0].user_uuid;
        resolve(data);
      }
    });
  });
}

export async function deleteData(uuid: Data["uuid"], user_uuid: User["uuid"]): Promise<void> {
  const sql = `DELETE FROM data WHERE uuid = ? AND user_uuid = ?`;
  try {
    db.run(sql,[uuid, user_uuid]);
  } catch (error) {
    console.error("Error occurred during JSON parsing:", error);
  }
}

export async function getAllData(user_uuid: User["uuid"]): Promise<Data[] | undefined> {
  // TODO: Add input validation
  const sql = `SELECT * FROM data WHERE user_uuid = ?`;
  return new Promise<Data[] | undefined>((resolve, reject) => {
    db.all(sql, [user_uuid], (err: any, rows: Data[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

export async function getCurrentData(user_uuid: User["uuid"]): Promise<Current> {
  // TODO: Add input validation
  const sqlComplete = `SELECT * FROM data WHERE complete = ? AND user_uuid = ?`;
  const sqlIncomplete = `SELECT * FROM data WHERE complete = ? AND user_uuid = ?`;
  let currentComplete: Data[] = [];
  let currentIncomplete: Data[] = [];

  return new Promise<Current>((resolve, reject) => {
    db.all(sqlIncomplete, [0,user_uuid], (err: any, rowsIncomplete: Data[]) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        if (rowsIncomplete) {
          currentIncomplete = rowsIncomplete;
        }
        db.all(sqlComplete, [1, user_uuid], (err: any, rowsComplete: Data[]) => {
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
