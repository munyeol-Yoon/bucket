const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connect = require("./schemas/index"); // index 를 적지 않고 폴더명만 적어도 자동적으로 index.js 를 가져온다.
const routers = require("./routers");

dotenv.config();

const app = express();

const port = process.env.PORT;
connect();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("assets"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", routers);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
