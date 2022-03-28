const verifyAdmin = (req, res, next) => {
  const {types} = req.user;
  if(types != 'Admin'){
    return res.status(403).send("Invalid User Access");
  }
  return next();
}; 

module.exports = verifyAdmin; 