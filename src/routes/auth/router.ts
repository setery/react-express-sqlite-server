import express from "express";
import {
  handleCheckUser,
  handleCreateUser,
  handleLoginUser,
  handleLogout,
} from "./handlers";
import { handleRequiresAuth } from "../../middleware/permissions";

const router = express.Router();

// @route GET /api/auth/test
router.get("/test", (req, res) => {
  res.send("Auth route working");
});

router.post("/register", handleCreateUser);
router.post("/login", handleLoginUser);
router.put("/logout", handleRequiresAuth, handleLogout);
router.get("/current", handleRequiresAuth, handleCheckUser);

export default router;
