require("dotenv").config();
import { db } from "./client";
import bycrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface User {
  uuid?: number;
  email: string;
  password: string;
  name: string;
}
export interface Token {
  token: string;
  user: User;
}
interface MyPayload extends JwtPayload {
  userId: string;
}

export async function createUser(user: User): Promise<Token> {
  // TODO: add validations
  const sqlSearch = `SELECT * FROM user WHERE email = ?`; // regexp validation

  const sql = `INSERT INTO user(email, password, name)
                VALUES(?,?,?)`;
  //hash password
  const hashedPassword = await bycrypt.hash(user.password, 12);

  return new Promise<Token>((resolve, reject) => {
    db.all(sqlSearch, [user.email], (err: any, rows: User[]) => {
      if (err) {
        reject(err);
      }
      if (rows.length > 0) {
        reject("There is already a user with this email");
      } else {
        const newUser: User = user;
        newUser.password = hashedPassword;
        db.run(sql, [user.email, hashedPassword, user.name]);
        const payload: MyPayload = { userId: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
          expiresIn: "7d",
        });
        const response: Token = { token, user };
        resolve(response);
      }
    });
  });
}

export async function getUserAuth(user: User): Promise<Token> {
  // TODO: Add input validation
  const sql = `SELECT * FROM user WHERE email = ? LIMIT 1`;

  return new Promise<Token>((resolve, reject) => {
    db.all(sql, [user.email], async (err: any, row: User[]) => {
      if (err) {
        reject("there was a problem with the transaction");
      }
      // email check
      if (!row || row.length === 0) {
        reject("There was a problem with your login credentials");
      } else {
        // password check
        const passwordMatch = await bycrypt.compare(
          user.password,
          row[0].password
        );
        if (passwordMatch) {
          const payload: MyPayload = { userId: user.email };
          const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn: "7d",
          });
          const hashedPassword = await bycrypt.hash(user.password, 12);
          user.password = hashedPassword;
          const response: Token = { token, user };
          resolve(response);
        } else {
          reject("There was a problem with your login credentials");
        }
      }
    });
  });
}

export async function getUserByEmail(
  email: User["email"]
): Promise<User | undefined> {
  const sql = `SELECT * FROM user WHERE email = ? LIMIT 1`;
  return new Promise<User | undefined>((resolve, reject) => {
    db.all(sql, [email], (err: any, row: User[]) => {
      if (err) {
        reject("email not found" + err);
      } else {
        resolve(row[0]);
      }
    });
  });
}
