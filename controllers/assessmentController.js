const {assessmentModel, validate} = require('../models/assessmentModel.js');
const {UserModel} = require('../models/userModel.js');
/**
 * assessmentController.js
 *
 * @description :: Server-side logic for managing assessments.
 */
module.exports = {

  /**
   * assessmentController.list()
   */
  list: (req, res) => {
    assessmentModel.find(req.query.where, req.query.fields, req.query.sort, (err, assessments) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting assessment.',
          error: err
        });
      }
      return res.json(assessments);
    });
  },

  /**
   * assessmentController.show()
   */
  show: (req, res) => {
    let id = req.params.id;
    assessmentModel.findOne({_id: id}, (err, assessment) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting assessment.',
          error: err
        });
      }
      if (!assessment) {
        return res.status(404).json({
          message: 'No such assessment'
        });
      }
      return res.json(assessment);
    });
  },

  /**
   * assessmentController.create()
   */
  create: (req, res) => {
    const {title, description, mentor, deadline} = req.body;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

     UserModel.findOne({ _id: mentor, userType: { $ne: 'Student' } }, (err, user) => {
          if (err){
            return res.status(500).json({
                message: 'Error when checking mentor',
                error: err
              });
          }
          else{
              if(!user) return res.status(404).json({message: 'Mentor User not found'});

              let assessment = new assessmentModel({
                title : title,
                description : description,
                mentor : {
                  _id: mentor,
                  name: user.name,
                  email: user.email
                },
                deadline : deadline
              });
          
               assessment.save((err, assessment) => {
                if (err) {
                  return res.status(500).json({
                    message: 'Error when creating assessment',
                    error: err
                  });
                }
                return res.status(201).json(assessment);
              });
          }
      });
  },

  /**
   * assessmentController.update()
   */
  update: (req, res) => {
    let id = req.params.id;
    const {title, description, mentor, deadline} = req.body;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    UserModel.findOne({ _id: mentor, userType: { $ne: 'Student' } }, (err, user) => {
      if (err){
        return res.status(500).json({
            message: 'Error when checking mentor',
            error: err
          });
      }
      else{
          if(!user) return res.status(404).json({message: 'Mentor User not found'});

          assessmentModel.findOne({_id: id}, (err, assessment) => {
            if (err) {
              return res.status(500).json({
                message: 'Error when getting assessment',
                error: err
              });
            }
            if (!assessment) {
              return res.status(404).json({
                message: 'No such assessment'
              });
            }
      
            assessment.title = title ? title : assessment.title;
            assessment.description = description ? description : assessment.description;
            assessment.mentor = mentor ? { _id: mentor, name: user.name, email: user.email} : assessment.mentor;
            assessment.deadline = deadline ? deadline : assessment.deadline;
            
            assessment.save( (err, assessment) => {
              if (err) {
                return res.status(500).json({
                  message: 'Error when updating assessment.',
                  error: err
                });
              }
      
              return res.json(assessment);
            });
          });
      }
  });
  },

  /**
   * assessmentController.remove()
   */
  remove: (req, res) => {
    let id = req.params.id;
    assessmentModel.findByIdAndRemove(id, (err, assessment) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the assessment.',
          error: err
        });
      }
      return res.json({message: 'Assessment Successfully Deleted!'});
    });
  }
};
