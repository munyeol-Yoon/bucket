const express = require("express");
const dotenv = require("dotenv");
const connect = require("./schemas/index");

dotenv.config();

const app = express();

const port = process.env.PORT;
connect();

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
