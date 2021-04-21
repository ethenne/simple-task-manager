const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;

const todoRoutes = express.Router();
let Todo = require('./models/ToDoModel');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://hope:*Tardis*@cluster0.9fh5g.mongodb.net/app?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

todoRoutes.route('/').get(function (req, res) {
    Todo.find((err, todos) => {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get((req, res) => {
    let id = req.params.id;
    Todo.findById(id, function (err, todo) {
        res.json(todo);
    });
});

todoRoutes.route('/update/:id').post((req, res) => {
    Todo.findById(req.params.id, (err, todo) => {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_name = req.body.todo_name;
            todo.todo_description = req.body.todo_description;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;
            todo.todo_createdAt = req.body.todo_createdAt;
            todo.todo_finishedAt = req.body.todo_finishedAt
    

        todo.save().then(todo => {
            res.json('Todo updated!');
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

todoRoutes.route('/add').post((req, res) => {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({ 'todo': 'todo added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

todoRoutes.route('/delete/:id').post(function (req, res) {
    const id = req.params.id;
 
    Todo.deleteOne({ _id: id }, function (err, result) {
        res.send( (result === 1) ? { msg: 'Deleted' } : { msg: 'error: '+ err } );
    });
  });

app.use('/todos', todoRoutes);

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});