const express = require("express");

const goodsRouter = require("./goods");
const cartsRouter = require("./cart");

const router = express.Router();

router.use("/goods", goodsRouter);
router.use("/carts", cartsRouter);

module.exports = router;
