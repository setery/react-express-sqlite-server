import { Request, Response } from "express";
import {
  createData,
  updateData,
  deleteData,
  getAllData,
  getCurrentData,
  Data,
} from "../../sqlite/data-dao";

export function handleCreateData(req: Request, res: Response): void {
  const data = req.body;
  createData(data)
    .then((response) => {
      console.log("Success creating data", response);
      res.status(201).send(response);
    })
    .catch((error) => {
      console.error("Error while creating data", error);
      res.status(500).send({ error: error.message });
    });
}

export function handleUpdateData(req: Request, res: Response): void {
  const data = req.body;
  data.uuid = req.body.uuid || req.params.uuid;
  updateData(data)
    .then((response) => {
      console.log("Success updating data", response);
      res.status(200).send(response);
    })
    .catch((error) => {
      console.error(`Error while updating data with id ${data.uuid}`, error);
      res.status(500).send({
        error: `Error while updating bookable with id ${data.uuid}`,
      });
    });
}

export function handleDeleteData(req: Request, res: Response): void {
  const dataId = req.body.uuid || req.params.uuid;

  deleteData(dataId)
    .then((response) => {
      console.log("Success deleting data", response);
      res.status(200).send(response);
    })
    .catch((error) => {
      console.error(`Error while deleting data with id ${dataId}`, error);
      res.status(500).send({
        error: `Error while deleting data with id ${dataId}`,
      });
    });
}

export function handleGetAllData(req: Request, res: Response): void {
  getAllData()
    .then((response) => {
      console.log("Success get all data", response);
      res.status(200).send(response);
    })
    .catch((error) => {
      console.error("Error while getting all data", error);
      res.status(500).send({ error: "Error while getting all data" });
    });
}

export function handleGetCurrentData(req: Request, res:Response): void{
  getCurrentData()
    .then((response) => {
      console.log("Success get all data", response);
      res.status(200).send({incomplete: response.incompleteToDos, complete: response.completeToDos});  ///test if works
    })
    .catch((error) => {
      console.error("Error while getting all data", error);
      res.status(500).send({ error: "Error while getting all data" });
    });
}