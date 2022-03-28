const {submissionModel, validate} = require('../models/submissionModel.js');
const {assessmentModel} = require('../models/assessmentModel.js');
const {UserModel} = require('../models/userModel.js');
/**
 * submissionController.js
 *
 * @description :: Server-side logic for managing submissions.
 */
module.exports = {

  /**
   * submissionController.list()
   */
  list: (req, res) => {
    const {user_id, types} = req.user;

    let isStudent = {};
    if(types == 'Student'){
      isStudent = {'student._id' : user_id}
    }

    submissionModel.find(isStudent, (err, submissions) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting submission.',
          error: err
        });
      }
      return res.json(submissions);
    });
  },

  /**
   * submissionController.show()
   */
  show: (req, res) => {
    const {user_id, types} = req.user;
    let id = req.params.id;

    let isStudent = {_id: id};
    if(types == 'Student'){
      isStudent = {_id: id, 'student._id' : user_id}
    }

    submissionModel.findOne(isStudent, (err, submission) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting submission.',
          error: err
        });
      }
      if (!submission) {
        return res.status(404).json({
          message: 'No such submission'
        });
      }
      return res.json(submission);
    });
  },

  /**
   * submissionController.create()
   */
  create: async (req, res) => {
    const {file_link, grades, assessment, student, mentor} = req.body;

    let assessments = await assessmentModel.findById(assessment).exec();
    if(!assessments) return res.status(404).json({message: 'Assessment not found'});

    let students = await UserModel.findOne({  _id: student, userType: 'Student' }).exec();
    if(!students) return res.status(404).json({message: 'Student not found'});

    let mentors = await UserModel.findOne({  _id: mentor, userType: { $ne: 'Student' } }).exec();
    if(!mentors) return res.status(404).json({message: 'Mentor not found'});

    let isSame = await submissionModel.findOne({  'assessment._id': assessment, 'student._id': students }).exec();
    if(isSame) return res.status(409).json({message: 'Already Submitted'});

    let submission = new submissionModel({
			file_link,
			grades,
			assessment : {
        _id: assessments._id,
        title: assessments.title
      },
			student : {
        _id: students._id,
        name: students.name,
        email: students.email
      },
			mentor : {
        _id: mentors._id,
        name: mentors.name,
        email: mentors.email
      }
    });

    submission.save((err, submission) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when creating submission',
          error: err
        });
      }
      return res.status(201).json(submission);
    });
  },

  /**
   * submissionController.update()
   */
  update: (req, res) => {
    let id = req.params.id;
    submissionModel.findOne({_id: id}, async (err, submission) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting submission',
          error: err
        });
      }
      if (!submission) {
        return res.status(404).json({
          message: 'No such submission'
        });
      }


      const {file_link, grades, assessment, student, mentor} = req.body;

      if(assessment){
        var assessments = await assessmentModel.findById(assessment).exec();
        if(!assessments) return res.status(404).json({message: 'Assessment not found'});
      }
      
  
      if(student){
        var students = await UserModel.findOne({  _id: student, userType: 'Student' }).exec();
        if(!students) return res.status(404).json({message: 'Student not found'});
      }

      if(mentor){
        var mentors = await UserModel.findOne({  _id: mentor, userType: { $ne: 'Student' } }).exec();
        if(!mentors) return res.status(404).json({message: 'Mentor not found'});
      }
  
      
  
      submission.file_link = file_link ? file_link : submission.file_link;
			submission.grades = grades ? grades : submission.grades;
			submission.assessment = assessment ? { _id: assessments._id, title: assessments.title } : submission.assessment;
			submission.student = student ? { _id: students._id, name: students.name, email: students.email } : submission.student;
			submission.mentor = mentor ? { _id: students._id, name: students.name, email: students.email } : submission.mentor;
			
      submission.save( (err, submission) => {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating submission.',
            error: err
          });
        }

        return res.json(submission);
      });
    });
  },

  /**
   * submissionController.remove()
   */
  remove: (req, res) => {
    let id = req.params.id;
    submissionModel.findByIdAndRemove(id, (err, submission) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the submission.',
          error: err
        });
      }
      return res.json({message: 'Submission Successfully Deleted!'});
    });
  }
};
