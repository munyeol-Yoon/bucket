const express = require("express");

const goodsRouter = require("./goods");
const cartsRouter = require("./carts");
const usersRouter = require("./users");
const authRouter = require("./auth");

const router = express.Router();

router.use("/goods", goodsRouter);
router.use("/carts", cartsRouter);
router.use("/users", usersRouter);
router.use("/auth", authRouter);

module.exports = router;
