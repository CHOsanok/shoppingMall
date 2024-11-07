const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
const app = express();
const cors = require("cors");
require("dotenv").config();
const MONGODB_URI_PROD = process.env.MONGODB_URI_PROD;
const PORT = process.env.PORT || 4000;
const allowedOrigins = [
  "http://localhost:3000",
  "https://shopping-mall-sigma.vercel.app",
];

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      // 모든 도메인 허용
      callback(null, true);
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // 자격 증명 포함 요청 허용
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", indexRouter);

mongoose
  .connect(MONGODB_URI_PROD)
  .then(() => console.log("Mongoose connected"))
  .catch((error) => console.log("DB connection failed:", error));

app.listen(PORT, () => {
  console.log("server on");
});
