import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User, getUserByEmail } from "../sqlite/user-dao";

declare module 'express' {
  interface Request {
      user?: User;
      userId?: string; 
  }
}

export async function handleRequiresAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies["access-token"];
  let isAuthed = false;

  if (token) {
    //logic
    try {
      const decodedToken = await jwt.verify(token as string, process.env.JWT_SECRET as string) as JwtPayload;
      req.userId = decodedToken.userId as string
      try {
        await getUserByEmail(req.userId).then((response) => {
          const user = response;
          req.user = user;
          isAuthed = true;
        }).catch((err)=>{
          throw Error(err);
        });
      } catch {
        isAuthed = false;
      }
    } catch (err){
      isAuthed = false;

    }
  }
  if (isAuthed) {
    return next();
  } else {
    return res.status(401).send("Unauthorized");
  }
}
