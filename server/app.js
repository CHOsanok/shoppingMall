const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const indexRouter = require("./routes/index");
const app = express();
const MONGODB_URI_PROD = process.env.MONGODB_URI_PROD;
const PORT = process.env.PORT || 4000;

require("dotenv").config();

app.use(cors());
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
