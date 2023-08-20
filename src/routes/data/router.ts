import express from "express";
import {
  handleCreateData,
  handleUpdateData,
  handleDeleteData,
  handleGetAllData,
  handleGetCurrentData,
  handleUpdateComplete,
  handleUpdateIncomplete,
} from "./handlers";
import { handleRequiresAuth } from "../../middleware/permissions";

const router = express.Router();

router.post("/", handleRequiresAuth, handleCreateData);
router.put("/:uuid", handleRequiresAuth, handleUpdateData);
router.put("/:uuid/complete", handleRequiresAuth, handleUpdateComplete)
router.put("/:uuid/incomplete", handleRequiresAuth, handleUpdateIncomplete)
router.delete("/:uuid", handleRequiresAuth, handleDeleteData);
router.get("/", handleRequiresAuth, handleGetAllData);
router.get("/current", handleRequiresAuth, handleGetCurrentData);

export default router;
