var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'name' : { type: String, required: true },
	'email' : { type: String, required: true, unique: true },
	'password' : { type: String, required: true },
	'token' : String,
	'userType' : {
        type: String,
        enum : ['Student','Mentor','Admin'],
        default: 'Student'
    },
	'created_at' : { type: Date, default: Date.now },
});

module.exports = mongoose.model('user', userSchema);
