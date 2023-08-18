import express from "express";
import {
  handleCreateData,
  handleUpdateData,
  handleDeleteData,
  handleGetAllData,
  handleGetCurrentData,
} from "./handlers";

const router = express.Router();

router.post("/", handleCreateData);
router.put("/:uuid", handleUpdateData);
router.delete("/:uuid", handleDeleteData);
router.get("/", handleGetAllData);
router.get("/current", handleGetCurrentData);

export default router;
