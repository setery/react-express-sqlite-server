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
  userId: string; // Add any other properties you need in the payload
}

export async function createUser(user: User): Promise<User | undefined> {
  // TODO: add validations
  // Existing email //Register field

  const sql = `INSERT INTO users(email, password, name)
                VALUES(?,?,?)`;
  //hash password
  const hashedPassword = await bycrypt.hash(user.password, 12);
  const newUser: User = user;
  newUser.password = hashedPassword;
  try {
    db.run(sql, [user.email, hashedPassword, user.name]); // insert data
    return newUser;
  } catch (error) {
    console.error("Error occurred during JSON parsing:", error);
    return undefined;
  }
}

export async function getUserAuth(user: User): Promise<Token> {
  // TODO: Add input validation
  const sql = `SELECT * FROM users WHERE email = ? LIMIT 1`;

  return new Promise<Token>((resolve, reject) => {
    db.all(sql, [user.email], async (err: any, row: User[]) => {
      if (err) {
        //transaction check
        console.error(err);
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
  // TODO: Add input validation
  const sql = `SELECT * FROM users WHERE email = ? LIMIT 1`;
  return new Promise<User | undefined>((resolve, reject) => {
    db.all(sql, [email], (err: any, row: User[]) => {
      if (err) {
        reject("email not found"+ err);
      } else {
        resolve(row[0]);
      }
    });
  });
}
