import express from "express";
import dataRouter from "./data/router"

const router = express.Router();

/** Data routes */
router.use("/Data", dataRouter);

export default router;