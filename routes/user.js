const Users = require("../modals/Users");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyWebToken"); //TAKEING VERIFY TOKEN METHODS WE CREATED

const router = require("express").Router();

//UPDATE
// ------

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {   
//WITH THE HELP OF "verifyTokenAndAuthorization" WE JUST CHECKED AUTHENTICATED OR NOT THEN
//AFTER WE ARE JUST CALLING HERE THIS PART IS next() 

  if (req.body.password) {  //CHECKING IF PASSWORD IS AVAILABLE OR NOT
    req.body.password = CryptoJS.AES.encrypt( //ENCRTPYING PASSWORD
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await Users.findByIdAndUpdate(  //BY USING Users MODEL FIND BY ID AND UPDATING DATAS
      req.params.id,
      {
        $set: req.body,  //SET ING THE BODY DATA
      },
      { new: true } //SETING NEW FILES TRUE (UPDATING TRUE)
    );
    res.status(200).json(updatedUser); //SEND STATUS
  } catch (err) {
    res.status(500).json(err); //IF NOT SEND ERROR
  }
});

//DELETE
//------

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  //WITH THE HELP OF "verifyTokenAndAuthorization" WE JUST CHECKED AUTHENTICATED OR NOT THEN
//AFTER WE ARE JUST CALLING HERE THIS PART IS next() 

  try {
    await Users.findByIdAndDelete(req.params.id);  //BY USING Users MODEL FIND BY ID AND DELETE DATA
    res.status(200).json("User has been deleted"); //IF SUCESS SEND STATUS
  } catch (err) {
    res.status(500).json(err);//IF NOT SEND ERROR
  }
});

//GET USER
//------

router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => { 
   //WITH THE HELP OF "verifyTokenAndAdmin" WE JUST CHECKED IF THIS ADMIN OR NOT THEN ONLYM ADMIN CAN DO THIS OPERATIONS
//AFTER WE ARE JUST CALLING HERE THIS PART IS next() 

  try {
    const user = await Users.findById(req.params.id); //BY USING Users MODEL FIND BY ID AND STORE THAT PERTICULAR ID DATA IN user
    const { password, ...others } = user._doc; //USING SPREAD OPERATORS SEPPERATING PASSWORD AND OTHER 
    res.status(200).json(others); //ONLY SEND RESPONCE OF OTHERS 
  } catch (err) {
    res.status(500).json(err);//IF NOT SEND ERROR
  }
});

//GET ALL USERS
//-------------

router.get("/", verifyTokenAndAdmin, async (req, res) => {
   //WITH THE HELP OF "verifyTokenAndAdmin" WE JUST CHECKED IF THIS ADMIN OR NOT THEN ONLYM ADMIN CAN DO THIS OPERATIONS
//AFTER WE ARE JUST CALLING HERE THIS PART IS next() 


  const query = req.query.new; //CREATING A QUARY OF NEW (req.query.'new' - HERE "new" IS THE QUARY NAME WHILE WE USING IN LINK)
  try {
    const user = query  //GIVING CONDITION IF QUARY EXIST IN LINK
      ? await Users.find().sort({ _id: -1 }).limit(2) //RETURN ONLY 2 FIRST USER DATA
      : await Users.find(); //RETURN ALL USER DATAS
    res.status(200).json(user); //IF SUCESS SEND STATUS
  } catch (err) {
    res.status(500).json(err);//IF NOT SEND ERROR
  }
});

//GET USER STATS

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
     //WITH THE HELP OF "verifyTokenAndAdmin" WE JUST CHECKED IF THIS ADMIN OR NOT THEN ONLYM ADMIN CAN DO THIS OPERATIONS
//AFTER WE ARE JUST CALLING HERE THIS PART IS next() 

//HERE WE CHECKING HOW MANY NEW USER IS REGISTER LAST MONTHS WE WANT A LIST OF EACH MONTH OF REGISTERD USER LIKE {AUG , 3 },{SEP ,5} ETC...
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1)); //FOR TAKING LAST YEAR

  try {
    const data = await Users.aggregate([
      { $match: { createdAt: { $gte: lastYear } } }, //HERE WE TAKE  "createdAt" FOR CHECKING MONTHS AND ALSO "$gte" IS GREATERTHAN OR EQUAL TO THAT LASTYEAR
      {
        $project: {
          month: { $month: "$createdAt" }, //WE CREATED MONTH VARIABLE AND '{ $month: "$createdAt" }' THIS METHOD IS TAKE MONTH FROM "$createdAt"
          //eg:-"createdAt": "2023-06-05T07:19:57.495Z", HERE '06' WILL BE STORE INTO THE MONTH  
        },
      },
      {
        //THIS WILL RETURN TO THE DATA (DATA WILL BE OUR RESPONCE) "$month" IS MONTH NUMBER "total" HAS ORU USER IN NUMBER
        $group: {  
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(data); //IF SUCESS SEND STATUS
  } catch (err) {
    res.status(500).json(err);//IF NOT SEND ERROR
  }
});

module.exports = router;

// Study Routes

// router.get("/usertest", (req, res) => {
//   res.send("user test is successfull");
// });

// router.post("/userposttest",(req,res)=>{
//     const username=req.body.username;
//     console.log(username);
//     res.send("your username is :"+username)
// })
