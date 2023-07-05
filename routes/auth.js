const router = require("express").Router();
const User = require("../modals/Users");
const CryptoJS = require("crypto-js"); //for encrypt datas
const jwt = require("jsonwebtoken"); //for json web token

//REGISTER
//---------

//POST TO THE DATABASE
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(  // PASSWORD ECRIPTING 
      req.body.password,
      process.env.PASS_SEC //THIS IS FOR A SECRET KEY THAT STORED IN ENV FILE
    ).toString(),
  });

  try {
    // IF IT IS TRUE RETURN CODE 200 AND SAVED DATA
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {

    //IF IT IS FALSE RETURN CODE 500 AND ERROR
    res.status(500).json(err);
  }
});

//LOGIN
//-----

router.post("/login", async (req, res) => {
  try {

    // GETING ONE DATA FROM USER
    const user = await User.findOne({ username: req.body.username });

    // CHECKING IF THERE IS ANY USER ,IF NOT, RETURN STATUS CODE 401 AND ERROR MESSAGE

    !user && res.status(401).json("Wrong credentials!");

    // dECRYPT THE PASSWORD WHILE WE ECRIPT IN REGISTER 
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
      //STORING ORIGINAL PASSWORD
    const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    //CHECKING IS THERE PASSWORD IS SAME AS OUR BODY PASSWORD IF NOT SEND ERROR
    Originalpassword !== req.body.password &&
      res.status(401).json("Wrong credentials!");


      // CREATEING JWT ACCESS WEB TOKEN WITH USER ID 
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,  //THIS IS FOR A SECRET KEY THAT STORED IN ENV FILE
      { expiresIn: "3d" }
    );


//USING SPREAD OPERATORS SET RESONCE WITHOUT THE PASSWORD
    const { password, ...others } = user._doc;


    // OUR STATUS FOR SUCESS OR FAIL 
    res.status(200).json({...others,accessToken}); // SENDING DATA AND ALSO ACCESS TOKEN IN THE RESPONCE
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
