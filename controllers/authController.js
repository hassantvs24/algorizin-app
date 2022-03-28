require('dotenv').config();
const {UserModel, validate} = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
/**
 * authController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    home: async function (req, res) {
        try { 
            const {user_id, name, email} = req.user;
            const user = await UserModel.findOne({ _id: user_id }).select({"password": 0});
            return res.json(user);
          } catch (error) {
            return res.status(500).send("Invalid User");
          }
    },

    login: async function (req, res) {
        try {
            // Get user input
            const { email, password } = req.body;
        
            // Validate user input
            if (!(email && password)) {
              return res.status(400).send("All input is required");
            }
            // Validate if user exist in our database
            const user = await UserModel.findOne({ email });
        
            if (user && (await bcrypt.compare(password, user.password))) {
              // Create token
              const token = user.generateAuthToken();
              user.token = token;
              // user
              return res.status(200).json(user);
            }
            return res.status(400).send("Invalid Credentials");
          } catch (err) {
            return res.status(500).send("Invalid Login");
          }

    },

    register: async function (req, res) {

        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
      
        const {name, email, password, userType} = req.body;
        //Encrypt user password
        let encryptedPassword = await bcrypt.hash(password, 10);

        const oldUser = await UserModel.findOne({ email });

        if (oldUser) return res.status(409).send("User Already Exist");
  

        var User = new UserModel({
          name : name,
		      userType : userType,
          email : email.toLowerCase(),
          password : encryptedPassword
        });

        let user = await User.save();
        const token = user.generateAuthToken();

        return res.status(201).json({user_id: user._id, name: user.name, email: user.email, token: token});
    }
};
