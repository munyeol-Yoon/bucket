const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = async (req, res, next) => {
  const { authorization } = req.cookies;

  const [authType, authToken] = (authorization ?? "").split(" ");

  if (authType === "Bearer" || !authToken) {
    return res
      .status(400)
      .json({ errorMessage: "로그인 후에 이용할 수 있습니다." });
  }

  try {
    const { userId } = jwt.verify(authToken, process.env.SEKRET);

    const user = await User.findById(userId);
    res.locals.user = user;

    next();
  } catch (err) {
    console.error(error);
    return res
      .status(400)
      .json({ errorMessage: "로그인 후에 이용할 수 있는 기능입니다." });
  }
};
