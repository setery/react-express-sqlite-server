import config from "config";
import app from "./app";

const PORT = config.get<number>("server.port"); // get the port number from the configuration file

// start the HTTP server
app.listen(PORT, () => {
  console.log(`The server is now running on Port ${PORT}`);
});
