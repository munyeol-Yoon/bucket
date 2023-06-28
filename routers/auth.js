const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return res.status(400).json({ errorMessage: "로그인 실패" });
  }

  const token = await jwt.sign({ userId: user.id }, process.env.SECRET);

  res.cookie("Authorization", `Bearer ${token}`);

  return res.status(200).json({ token });
});

module.exports = router;
