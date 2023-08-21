import cors from "cors";
import express from "express";
import router from "./routes/router";
import cookieParser from "cookie-parser"

const app = express(); // create a new express app

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(cors());
// Configure endpoints
app.use("/", router);

export default app;