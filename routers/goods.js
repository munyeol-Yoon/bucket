const express = require("express");

const Goods = require("../schemas/goods");
const Cart = require("../schemas/cart");

const router = express.Router();

// 상품 목록 조회, ?category=전자기기
router.get("/", async (req, res) => {
  const { category } = req.query;
  const goods = await Goods.find(category ? { category } : {})
    .sort("-date")
    .exec();

  const result = goods.map((item) => {
    return {
      goodsId: item.goodsId,
      name: item.name,
      price: item.price,
      thumbnailUrl: item.thumbnailUrl,
      category: item.category,
    };
  });

  res.status(200).json({ goods: result });
});

// 장바구니 상품 추가
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

// goods 생성
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

router.put("/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ goodsId });

  if (existsCarts.length) {
    await Cart.updateOne(
      { goodsId: goodsId },
      { $set: { quantity: quantity } }
    );
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ message: "카트에 해당 상품이 없습니다." });
  }
});

router.delete("/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;

  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length) {
    await Cart.deleteOne({ goodsId });
    res.json({ result: "success" });
  } else {
    res.status(400).json({ message: "카트에 해당 상품이 없습니다." });
  }
});

module.exports = router;
