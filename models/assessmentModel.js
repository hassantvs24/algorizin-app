const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const fields = {	'title' : String,	'description' : String,	'mentor' : {	 	type: Schema.Types.ObjectId,	 	ref: 'userModel'	},	'deadline' : Date,	'created_at' : Date}

let assessmentSchema = new Schema(fields);

module.exports = mongoose.model('assessment', assessmentSchema);
