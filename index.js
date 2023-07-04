const express = require("express");

const app = express();

const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config();

mongoose
  .connect(
    process.env.MONGO_URL  // to secure mongo db key
  )
  .then(() => console.log("db connection successfull"))
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is Running!");
});
