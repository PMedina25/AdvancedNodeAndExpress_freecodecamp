const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let issueSchema = new Schema({
    issue_title: {
        type: String,
        required: [true, 'The title is necessary']
    },
    issue_text: {
        type: String,
        required: [true, 'The text is necessary']
    },
    created_on: {
        type: Date,
    },
    updated_on: {
        type: Date,
    },
    created_by: {
        type: String,
        required: [true, 'The created by is necessary']
    },
    assigned_to: {
        type: String,
        required: false
    },
    open: {
        type: Boolean,
        default: false
    },
    status_text: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Issue', issueSchema);