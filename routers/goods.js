const express = require("express");

const Goods = require("../schemas/goods");
const Cart = require("../schemas/cart");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

// 장바구니 조회
router.get("/cart", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;

  const carts = await Cart.find({ userId });

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

// 상품 상세 조회
router.get("/:goodsId", async (req, res) => {
  const { goodsId } = req.params;
  const goods = await Goods.findOne({ goodsId: goodsId }).sort("-date").exec();

  const result = {
    goodsId: goods.goodsId,
    name: goods.name,
    price: goods.price,
    thumbnailUrl: goods.thumbnailUrl,
    category: goods.category,
  };

  res.status(200).json({ goods: result });
});

// 장바구니 상품 추가
router.post("/:goodsId/cart", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ userId, goodsId });
  if (existsCarts.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "이미 장바구니에 해당하는 상품이 존재합니다.",
    });
  }

  await Cart.create({ userId, goodsId, quantity });

  res.json({ result: "success" });
});

// 굿즈 등록
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

// 장바구니 수정
router.put("/:goodsId/cart", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ userId, goodsId });

  if (existsCarts.length) {
    await Cart.updateOne(
      { userId, goodsId: goodsId },
      { $set: { quantity: quantity } }
    );
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ message: "카트에 해당 상품이 없습니다." });
  }
});

// 장바구니 삭제
router.delete("/:goodsId/cart", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { goodsId } = req.params;

  const existsCarts = await Cart.find({ userId, goodsId });
  if (existsCarts.length) {
    await Cart.deleteOne({ userId, goodsId });
    res.json({ result: "success" });
  } else {
    res.status(400).json({ message: "카트에 해당 상품이 없습니다." });
  }
});

module.exports = router;
