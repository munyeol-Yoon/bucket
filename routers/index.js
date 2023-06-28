const express = require("express");

const goodsRouter = require("./goods");
const cartsRouter = require("./carts");
const usersRouter = require("./users");

const router = express.Router();

router.use("/goods", goodsRouter);
router.use("/carts", cartsRouter);
router.use("/users", usersRouter);

module.exports = router;
