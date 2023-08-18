import express from "express";
import dataRouter from "./data/router"
import authRouter from "./auth/router"

const router = express.Router();

/** Data routes */
router.use("/data", dataRouter);

/** User routes */
router.use("/auth", authRouter)

export default router;