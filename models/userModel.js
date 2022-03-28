require('dotenv').config();
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const userSchema = new Schema({
	'name' : { type: String, minlength: 2, maxlength: 50, required: true },
	'email' : { type: String, minlength: 5, maxlength: 255, required: true, unique: true },
	'password' : { type: String, minlength: 5, maxlength: 1024, required: true },
	'token' : String,
	'userType' : {
        type: String,
        enum : ['Student','Mentor','Admin'],
        default: 'Student'
    },
	'created_at' : { type: Date, default: Date.now },
});

userSchema.methods.generateAuthToken = function(){
	const token = jwt.sign({ 
		user_id: this._id,
		types: this.userType,
		name: this.name,  
		email: this.email 
	}, 
	process.env.TOKEN_KEY, 
	{expiresIn:  process.env.TOKEN_EXP}
	);
	return token;
  }

  const UserModel = mongoose.model("user", userSchema);

  function validateUser(data) {
	const schema = Joi.object({
		name: Joi.string()
			.min(2)
			.max(50)
			.required(),
		email: Joi.string()
			.min(5)
			.max(255)
			.lowercase()
			.required()
			.email(),
		userType: Joi.string()
			.valid('Student', 'Mentor', 'Admin'),
		password: Joi.string()
			.min(5)
			.max(255)
			.required()
	});
  
	return schema.validate(data);
  }

  exports.UserModel = UserModel;
  exports.validate = validateUser;
