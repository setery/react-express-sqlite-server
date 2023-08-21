import { Request, Response } from "express";
import { createUser, getUserAuth } from "../../sqlite/user-dao";
import validateRegisterInput from "../../validations/registerValidations";

export function handleCreateUser(req: Request, res: Response): void {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    res.status(400).send(errors);
  } else {
    const user = req.body;
    createUser(user)
      .then((response) => {
        res.cookie("access-token", response.token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        });
        res.status(201).send(response);
      })
      .catch((error) => {
        res.status(500).send({ error: error});
      });
  }
}
export function handleLoginUser(req: Request, res: Response): void {
  const user = req.body;
  getUserAuth(user)
    .then((response) => {
      res.cookie("access-token", response.token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      });
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send({ error: error });
    });
}

export function handleLogout(req: Request, res: Response): void {
  try {
    res.clearCookie("access-token");
    res.send({ success: true });
  } catch (err) {
    res.status(500).send(err);
  }
}

export function handleCheckUser(req: Request, res: Response): void {
  const user = req.user;
  if (!user) {
    res.status(401).send("Unauthorized");
  }
  res.status(201).send(user);
}
