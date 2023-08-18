import { Request, Response } from "express";
import { createUser, getUserAuth, getUserByEmail } from "../../sqlite/user-dao";

export function handleCreateUser(req: Request, res: Response): void {
  const user = req.body;
  createUser(user)
    .then((response) => {
      console.log("Success creating user", response);
      res.status(201).send(response);
    })
    .catch((error) => {
      console.error("Error while creating user", error);
      res.status(500).send({ error: error.message });
    });
}
export function handleLoginUser(req: Request, res: Response): void {
  const user = req.body;
  getUserAuth(user)
    .then((response) => {
      console.log("Success login", response);
      res.cookie("access-token", response.token,{
        expires: new Date(Date.now() + 7 * 24* 60 * 60 * 1000),
        httpOnly: true,
        
      })
      res.status(200).send(response);
    })
    .catch((error) => {
      console.error("Error while login", error);
      res.status(500).send({ error: error.message });
    });
}
export function handleCheckUser(req: Request, res: Response): void {
    const user = req.user
    if(!user){
        res.status(401).send("Unauthorized")
    }
    res.status(201).send(user);
  }
