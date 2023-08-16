import express from "express";
import {
  handleCreateData,
  handleUpdateData,
  handleDeleteData,
  handleGetDataById,
  handleGetAllData,
} from "./handlers";

const router = express.Router();

router.post("/", handleCreateData);
router.put("/:uuid", handleUpdateData);
router.delete("/:uuid", handleDeleteData);
router.get("/:uuid", handleGetDataById);
router.get("/", handleGetAllData);

export default router;
