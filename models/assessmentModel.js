const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const fields = {

let assessmentSchema = new Schema(fields);

module.exports = mongoose.model('assessment', assessmentSchema);