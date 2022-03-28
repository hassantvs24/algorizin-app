const assessmentModel = require('../models/assessmentModel.js');

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
    let assessment = new assessmentModel({
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
  },

  /**
   * assessmentController.update()
   */
  update: (req, res) => {
    let id = req.params.id;
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

      assessment.title = req.body.title ? req.body.title : assessment.title;
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
      return res.status(204).json();
    });
  }
};