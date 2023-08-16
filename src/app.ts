import express from "express";
import router from "./routes/router";

const app = express(); // create a new express app

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configure endpoints
app.use("/", router);

export default app;