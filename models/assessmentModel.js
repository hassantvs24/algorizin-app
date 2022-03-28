const mongoose = require('mongoose');
const Joi = require('joi');

let Schema = mongoose.Schema;

const fields = {
	'title' : String,
	'description' : String,
	'mentor' : {
		_id: {
			type: Schema.Types.ObjectId,
			ref: 'userModel'
		},
		name: String,
		email: String
	},
	'deadline' : Date,
	'created_at' : { type: Date, default: Date.now }
}

let assessmentSchema = new Schema(fields);

const assessmentModel = mongoose.model("assessment", assessmentSchema);

function validateAssessment(user) {
	const schema = Joi.object({
		title: Joi.string()
			.min(2)
			.max(255)
			.required(),
		mentor: Joi.string().required(),
		description: Joi.string().required(),
		deadline: Joi.date().greater('now').required()
	});
  
	return schema.validate(user);
  }

exports.assessmentModel = assessmentModel;
exports.validate = validateAssessment;
