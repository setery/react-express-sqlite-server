import { Request, Response } from "express";
import {
  createData,
  updateData,
  deleteData,
  getAllData,
  getCurrentData,
  updateDataToComplete,
  updateDataToIncomplete,
} from "../../sqlite/data-dao";

export function handleCreateData(req: Request, res: Response): void {
  const data = req.body;
  const user_uuid = req.user?.uuid
  createData(data,user_uuid)
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
  const user_uuid = req.user?.uuid
  data.uuid = req.body.uuid || req.params.uuid;
  updateData(data,user_uuid)
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
  const user_uuid = req.user?.uuid

  deleteData(dataId,user_uuid)
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
  const user_uuid = req.user?.uuid
  getAllData(user_uuid)
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
  const user_uuid = req.user?.uuid;
  getCurrentData(user_uuid)
    .then((response) => {
      console.log("Success get all data", response);
      res.status(200).send({incomplete: response.incompleteToDos, complete: response.completeToDos});
    })
    .catch((error) => {
      console.error("Error while getting all data", error);
      res.status(500).send({ error: "Error while getting all data" });
    });
}

export function handleUpdateComplete(req: Request, res:Response): void{
  const data = req.body;
  const user_uuid = req.user?.uuid
  data.uuid = req.body.uuid || req.params.uuid;
  updateDataToComplete(data,user_uuid)
    .then((response) => {
      console.log("Success update data to complete", response);
      res.status(200).send(response);
    })
    .catch((error) => {
      console.error("Error while updating data to complete", error);
      res.status(500).send({ error: "Error while updating data to complete" });
    });
}

export function handleUpdateIncomplete(req: Request, res:Response): void{
  const data = req.body;
  const user_uuid = req.user?.uuid
  data.uuid = req.body.uuid || req.params.uuid;
  updateDataToIncomplete(data,user_uuid)
    .then((response) => {
      console.log("Success update data to incomplete", response);
      res.status(200).send(response);
    })
    .catch((error) => {
      console.error("Error while updating data to incomplete", error);
      res.status(500).send({ error: "Error while updating data to complete" });
    });
}