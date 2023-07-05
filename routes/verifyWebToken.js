const jwt = require("jsonwebtoken");


// VERIFICATION OF TOKEN
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;   // TAKING TOKEN FROM REQUSET HEADER
  if (authHeader) {
    const token = authHeader.split(" ")[1];  //INITIALICE TOKEN FROM 'authHeader'  WITH SPLIT WITHSPACE AND TAKE SECOND eg:- Bearer lhgvsdfgsdkfgvk 
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("Token is Not valid");  //CHECKING TOKEN VALID OR NOT
      req.user = user; 
      next(); //NEXT INDICATE THE BALANCE FUNCTION (WHEN WE CALL THIS ANY WERE AFTER NEXT WE WANT COUNTINUE) 
    });
  } else {
    return res.status(401).json("You are not authenticated!"); //IF WE FAIL WITH TOKEN THIS ERROR IS COME
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {  //CHECKING THE USER ID OR ID IS EQUAL TO THE GIVEN ID OR PARAMS ID  || CHECKING IS THIS ADMIN OR NOT 
      next();
    } else {
      res.status(403).json("You ae not allowed to do that!"); //IF NOT THIS ERROR WILL COME
    }
  });
};
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if ( req.user.isAdmin) { //THIS IS ONLY FOR ADMIN AREA ONLY ADMIN CAN ACCESS WHEN WE GIVE THIS FUNCTION
      next();
    } else {
      res.status(403).json("You ae not allowed to do that!"); //IF NOT THIS ERROR WILL COME
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
