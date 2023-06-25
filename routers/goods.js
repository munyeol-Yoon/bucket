const express = require("express");

const Goods = require("../schemas/goods");
const Cart = require("../schemas/cart");

const router = express.Router();

router.post("/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "이미 장바구니에 해당하는 상품이 존재합니다.",
    });
  }

  await Cart.create({ goodsId, quantity });

  res.json({ result: "success" });
});

router.post("/", async (req, res) => {
  try {
    const { goodsId, name, thumbnailUrl, category, price } = req.body;

    const goods = await Goods.find({ goodsId });
    if (goods.length) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "이미 있는 데이터 입니다." });
    }

    const createGoods = await Goods.create({
      goodsId,
      name,
      thumbnailUrl,
      category,
      price,
    });
    res.json({ goods: createGoods });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
