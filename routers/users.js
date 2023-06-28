const express = require("express");
const router = express.Router();
const User = require("../schemas/user");

router.post("/", async (req, res) => {
  const { email, nickname, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ errorMessage: "패스워드가 일치하지 않습니다." });
  }
  const isExistUser = await User.findOne({
    $or: [{ email }, { nickname }], // 이메일 또는 닉네임이 일치할 때 조회
  });
  if (isExistUser) {
    return res
      .status(400)
      .json({ errorMessage: "이메일 또는 닉네임이 이미 사용중입니다." });
  }

  const user = new User({ email, nickname, password });
  await user.save();

  return res.status(201).json({ message: "유저 생성 완료" });
});

module.exports = router;
