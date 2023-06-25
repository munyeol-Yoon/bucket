const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: "spa_mall",
    })
    .then(() => console.log("몽고 연결 완료"))
    .catch((err) => console.error(err));
};

mongoose.connection.on("error", (err) => {
  console.error("몽고 연결 에러", err);
});

module.exports = connect;
