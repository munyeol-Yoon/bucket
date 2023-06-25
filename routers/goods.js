const express = require("express");
const Goods = require("../schemas/goods");

const router = express.Router();

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
