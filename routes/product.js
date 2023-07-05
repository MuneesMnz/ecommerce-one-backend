const router = require("express").Router();
const Product = require("../modals/Product");
const { verifyTokenAndAdmin } = require("./verifyWebToken");

//POST PRODUCT
//------------

router.post("/", verifyTokenAndAdmin, async (req, res) => {
//WITH THE HELP OF "verifyTokenAndAdmin" WE JUST CHECKED IF THIS ADMIN OR NOT THEN ONLYM ADMIN CAN DO THIS OPERATIONS
//TAKING VALUES FROM BODYOF PRODUCT MODEL
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save(); //ASIGING TO A VARIABLE AND POST IT
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE PRODUCT
//--------------

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
 //WITH THE HELP OF "verifyTokenAndAdmin" WE JUST CHECKED IF THIS ADMIN OR NOT THEN ONLYM ADMIN CAN DO THIS OPERATIONS

  try {


    const updatedProduct = await Product.findByIdAndUpdate(//BY USING Users MODEL FIND BY ID AND UPDATING DATAS
      req.params.id,
      {
        $set: req.body, //SET ING THE BODY DATA
      },
      { new: true }//SETING NEW FILES TRUE (UPDATING TRUE)
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DETETE PRODUCT
//--------------

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
//WITH THE HELP OF "verifyTokenAndAdmin" WE JUST CHECKED IF THIS ADMIN OR NOT THEN ONLYM ADMIN CAN DO THIS OPERATIONS

  try {
    await Product.findByIdAndDelete(req.params.id);//BY USING Users MODEL FIND BY ID AND DELETE DATA
    res.status(200).json("Product has been Deleted ...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT (SINGLE)
//--------------------

router.get("/find/:id", async (req, res) => {
// HERE WE NOT USING ANY CONDITION FOR ADMIN OR USERS OR TOKEN AUTHENTICATION BOCOUSE IT CAN FETCH THE DATA
// FOR ALL USERS  
  try {
    const product = await Product.findById(req.params.id);//BY USING PRODUCT MODEL FIND BY ID AND STORE THAT PERTICULAR ID DATA IN PRODUCT
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});



//GET ALL PRODUCT
//---------------

router.get("/", async (req, res) => {
// HERE WE NOT USING ANY CONDITION FOR ADMIN OR USERS OR TOKEN AUTHENTICATION BOCOUSE IT CAN FETCH THE DATA
//HERE WE GIVING TWO QUERYS ONE IS NEW AND ANOTHER IS CATEGORY
  const qNew = req.query.new; 
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5); //NEW IS FOR ONLY TAKE LIMITED DATAS AND SORT BY DATE WE CAN SET LIMIT IN 'limit()'
    } else if (qCategory) {
      products = await Product.find({ //CATEGORY FOR CHECKING CATEGORIES AND RETURN AS SAME CATEGORY eg:- 'categories:men' RETURN WERE "men" INCLUDED PRODUCTS 
        categories: {
          $in: [qCategory],
        },
      });
    }else{
        products=await Product.find() //IF WE DIDN'T USE ANY QUERYS WE GOT FULL DATAS FROM RESPONCE
    }

    res.status(200).json(products)
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
