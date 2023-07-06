const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute=require('./routes/user')
const authRoute=require('./routes/auth')
const productRoute=require('./routes/product')
const cartRoute=require('./routes/cart')
const orderRoute=require('./routes/order')

dotenv.config();

mongoose
  .connect(
    process.env.MONGO_URL  // to secure mongo db key
  )
  .then(() => console.log("db connection successfull"))
  .catch((err) => {
    console.log(err);
  });

// app.get('/api/test',()=>{
//     console.log("test is successfull")
// })

app.use(express.json())

app.use("/api/auth",authRoute)
app.use("/api/user",userRoute)
app.use("/api/product",productRoute)
app.use("/api/cart",cartRoute)
app.use("/api/order",orderRoute)

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is Running!");
});
