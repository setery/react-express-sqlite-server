/*import config from config;

const PORT = config.get<number>("server.port"); // get port from config

require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("Express Server");
});

app.post("/name", (req,res)=>{
    if(req.body.name){
        return res.json({name: req.body.name})
    } else{
        return res.status(400).json({error: "no name provided"})
    }
});

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});*/