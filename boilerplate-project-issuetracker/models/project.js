const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let projectSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The project name is needed']
    }
});

projectSchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique'
});

module.exports = mongoose.model('Project', projectSchema);

