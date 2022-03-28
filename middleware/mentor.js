const verifyMentor = (req, res, next) => {
    const {types} = req.user;
    if(types != 'Admin' && types != 'Mentor' ){
      return res.status(403).send("Invalid User Access");
    }
    return next();
  }; 
  
  module.exports = verifyMentor; 