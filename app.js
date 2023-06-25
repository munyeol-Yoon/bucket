const express = require("express");
const dotenv = require("dotenv");
const connect = require("./schemas/index"); // index 를 적지 않고 폴더명만 적어도 자동적으로 index.js 를 가져온다.

dotenv.config();

const app = express();

const port = process.env.PORT;
connect();

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
