const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Todo = new Schema({
    todo_name: {
        type: String
    },
    todo_description: {
        type: String
    },
    todo_priority: {
        type: String
    },
    todo_completed: {
        type: Boolean
    },
    todo_createdAt: {
        type: String
    },
    todo_finishedAt: {
        type: String
    }
});

module.exports = mongoose.model('Todo', Todo);