import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';

function TodoList({match}) {
    const [todos, setTodos] = useState({ todos: [] });

    const Todo = props => (
        <tr className={props.className}>
            <td>{props.todo.todo_name}</td>
            <td>{props.todo.todo_description}</td>
            <td>{props.todo.todo_createdAt}</td>
            <td>{props.todo.todo_finishedAt}</td>
            <td>{props.todo.todo_priority}</td>
            <td>
                <Link
                    className="btn-floating waves-effect waves-light btn-small btn-flat margin-left-8"
                    to={"/edit/" + props.todo._id}
                >
                    <i className="material-icons teal-text small">create</i>
                </Link>
                <button
                    className="btn-floating waves-effect waves-light btn-small btn-flat margin-left-8"
                    type="button"
                    onClick={onDeleteToDo({ id: props.todo._id })}
                >
                    <i className="material-icons red-text">close</i>
                </button>

            </td>
        </tr>
    )

    const fetchTodos = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:4000/todos')
            data.length && data.forEach((todo) => {

                const startDate = transformDate(todo.todo_createdAt)
                const endDate = transformDate(todo.todo_finishedAt)
    
                todo.todo_createdAt = startDate
                todo.todo_finishedAt = endDate    
            })

            setTodos(data);
        }
        catch (e) {
            console.log(e)
        }
    }, [])

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const transformDate = (date) => {
        if (date.length) return date = new Date(date).toDateString()
        return 'Date not set';
    }

    const todoList = () => {
        return todos.length ? todos.map((currentTodo, i) => {
            const completed = currentTodo.todo_completed ? 'completed' : ''

            return <Todo todo={currentTodo} key={i} className={completed} />;
        }) : []
    }

    const onDeleteToDo = (id) => async () => {
        const updatedToDos = todos.filter(({_id: toDoId}) => toDoId !== id.id)
        setTodos(updatedToDos)
        window.M.toast({html: `todo successfully deleted`})
        try {
            await axios.post('http://localhost:4000/todos/delete/' + id.id, updatedToDos)

        } catch(e) {
            window.M.toast({html: `deleting todo failed`})
            console.log(e)
        }

    }

    return (
        <div>
            <div>
                <h3>Todos List</h3>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Todo Name</th>
                            <th>Todo Description</th>
                            <th>Todo Start Date</th>
                            <th>Todo Finish Date</th>
                            <th>Priority</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todoList()}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TodoList;