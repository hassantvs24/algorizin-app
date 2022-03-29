const mongoose = require('mongoose');
const Joi = require('joi');

let Schema = mongoose.Schema;

const fields = {
	'file_link' : {type: String, required: true},
	'grades' : {
		'mark': Number,
		'mentor_id': { type: Schema.Types.ObjectId, ref: 'userModel'},
		'mentor_name': String,
	},
	'assessment' : {
		 _id: {
			type: Schema.Types.ObjectId,
			ref: 'assessmentModel',
			required: true
		},
		title: String
	},
	'student' : {
		_id: {
			type: Schema.Types.ObjectId,
			ref: 'userModel',
			required: true
		},
		name: String,
		email: String
	},
	'mentor' : {
		_id: {
			type: Schema.Types.ObjectId,
			ref: 'userModel',
			required: true
		},
		name: String,
		email: String
	},
	'created_at' : { type: Date, default: Date.now }
}

let submissionSchema = new Schema(fields);

const submissionModel = mongoose.model("submission", submissionSchema);

function validateSubmission(data) {
	const schema = Joi.object({
		file_link: Joi.string()
			.min(2)
			.required(),
		assessment: Joi.string().required(),
		student: Joi.string().required(),
		mentor: Joi.string().required()
	});
  
	return schema.validate(data);
  }

exports.submissionModel = submissionModel;
exports.validate = validateSubmission;
