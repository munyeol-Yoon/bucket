const express = require("express");

const Cart = require("../schemas/cart");
const Goods = require("../schemas/goods");

const router = express.Router();

router.get("/", async (req, res) => {
  const carts = await Cart.find({});

  const goodsIds = carts.map((cart) => {
    return cart.goodsId;
  });

  const goods = await Goods.find({ goodsId: goodsIds });

  const result = carts.map((cart) => {
    return {
      quantity: cart.quantity,
      goods: goods.find((item) => item.goodsId === cart.goodsId), // array.find
    };
  });
  res.json({ carts: result });
});

module.exports = router;
