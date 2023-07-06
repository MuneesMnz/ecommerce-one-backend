const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyWebToken");
  
  const router = require("express").Router();
  const Order= require("../modals/Order");
  
  //CREATE
  
  router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
      const savedOrder = await newOrder.save();
      res.status(200).json(savedOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //UPDATE ORDER
  //------------
  
  router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
      const updateOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateOrder)
    } catch (err) {
      res.status(500).json(err)
    }
  });
  
  
  //DELETE ORDER
  //-----------
  
  router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
      try{
          await Order.findByIdAndDelete(req.params.id)
          res.status(200).json("Cart has been deleted...")
      }catch(err){
          res.status(500).json(err)
      }
  })
  
  //GET USER ORDER
  //-------------
  
  router.get("/find/:userId",verifyTokenAndAuthorization,async(req,res)=>{
      try{
          const orders=await Order.find({userId:req.params.userId});
          res.status(200).json(orders)
      }catch(err){
          res.status(500).json(err)
      }
  })
  
  //GET ALL
  
  router.get("/",verifyTokenAndAdmin,async(req,res)=>{
      try{
          const orders= await Oredr.find()
          res.status(200).json(orders)
      }catch(err){
          res.status(500).json(err)
      }
  })
  

  // GET MONTHLY INCOME

  router.get("/income",verifyTokenAndAdmin,async(req,res)=>{
    
  })
  
  
  
  module.exports = router;
  