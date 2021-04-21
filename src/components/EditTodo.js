import React, { useState, useCallback, useEffect } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router';


function EditTodo({ match }) {
    const params = match.params;
    const history = useHistory();

    const [todo, setTodo] = useState({
        todo_name: '',
        todo_description: '',
        todo_priority: '',
        todo_completed: false,
        todo_createdAt: '',
        todo_finishedAt: ''
    });

    const fetchTodos = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:4000/todos/' + params.id)

            data.todo_createdAt = transformDate(data.todo_createdAt)
            data.todo_finishedAt = transformDate(data.todo_finishedAt)

            setTodo(data);
        }
        catch (e) {
            console.log(e)
        }
    }, [params.id])

    const transformDate = (date) => {
        if (date.length) return date = new Date(date).toDateString()
        return 'Date not set';
    }

    const onChangeToDoName = (e) => {
        setTodo({ ...todo, todo_name: e.target.value })
    };

    const onChangeToDoDescription = (e) => {
        setTodo({ ...todo, todo_description: e.target.value })
    };

    const onChangeToDoPriority = (e) => {
        setTodo({ ...todo, todo_priority: e.target.name })
    };

    const onChangeTodoCompleted = (e) => {
        setTodo({ ...todo, todo_completed: !todo.todo_completed })
    }

    const onSelectStartDate = useCallback((e) => {
        setTodo((prev) => ({ ...prev, todo_createdAt: e }))
    }, []);

    const onSelectFinishDate = useCallback((e) => {
        setTodo((prev) => ({...prev, todo_finishedAt: e}))
    }, []);

    const onChangeDate = useCallback((e, elem) => {
        if(elem === 'started') {
            onSelectStartDate(e);
        } else {
            onSelectFinishDate(e)
        }
    }, [onSelectStartDate, onSelectFinishDate])

    const onSubmit = async (e) => {
        e.preventDefault();
        const newTodo = { ...todo };
        let isFormValid = true;
        const { todo_createdAt, todo_finishedAt } = newTodo;
        const isDateValid = new Date(todo_createdAt) > new Date(todo_finishedAt) ? false : true;

        for(let key in newTodo) {
            const excludingKeys = key !== 'todo_createdAt' && key !== 'todo_finishedAt';
            const emptyKeys = newTodo[key] === null || newTodo[key] === "";
            
            if (emptyKeys && excludingKeys) {
                isFormValid = false;
            }
        }

          if (isFormValid && isDateValid) {
            try{
                const { data } = await axios.post('http://localhost:4000/todos/update/' + params.id, newTodo)
                setTodo({ ...todo, ...e })
                window.M.toast({html: `${data}`})
                history.push('/');
            } catch(e) {
                console.log(e)
            }
        } else {
            !isFormValid && window.M.toast({ html: "All fields must be filled" });
            !isDateValid && window.M.toast({ html: "Start date can't be earlyer finish date" });
        }
    }
    useEffect(() => {
        fetchTodos();

        let elem = document.querySelectorAll(".datepicker");
        elem.forEach((el) => {
          window.M.Datepicker.init(el, {
            firstDay: 1,
            format: "ddd dd mmm yyyy",
            minDate: new Date(),
            autoClose: true,
            onSelect: (evt) => {
                onChangeDate(evt, el.id)
            },
  
          });
        });
    }, [fetchTodos, onChangeDate]);

    return (
        <div>
            <div style={{ marginTop: 10 }}>
                <h3>Edit Todo</h3>
                <div className="container row">
                    <form action="" className="col s12" onSubmit={onSubmit}>
                        <div className="row">
                            <div className="input-field col s6">
                                <input
                                    type="text"
                                    className="datepicker"
                                    id="started"
                                    defaultValue={todo.todo_createdAt}
                                />
                                <label className="active" htmlFor="started">Todo started</label>
                            </div>
                            <div className="input-field col s6">
                                <input
                                    type="text"
                                    className="datepicker"
                                    id="finished"
                                    defaultValue={todo.todo_finishedAt}
                                />
                                <label className="active" htmlFor="started">Todo finished</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input
                                    type="text"
                                    id="name"
                                    className="form-control"
                                    value={todo.todo_name}
                                    onChange={onChangeToDoName}
                                />
                                <label className="active" htmlFor="name">ToDo Name</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input
                                    type="text"
                                    id="description"
                                    className="form-control"
                                    value={todo.todo_description}
                                    onChange={onChangeToDoDescription}
                                />
                                <label className="active" htmlFor="description">ToDo Description</label>
                            </div>
                        </div>
                        <div className="row">
                            <p className="col s2">
                                <label>
                                    <input
                                        name="low"
                                        type="radio"
                                        className="with-gap"
                                        checked={todo.todo_priority === 'low'}
                                        onChange={onChangeToDoPriority}
                                    />
                                    <span>Low</span>
                                </label>
                            </p>
                            <p className="col s2">
                                <label>
                                    <input
                                        name="medium"
                                        type="radio"
                                        className="with-gap"
                                        checked={todo.todo_priority === 'medium'}
                                        onChange={onChangeToDoPriority}
                                    />
                                    <span>Medium</span>
                                </label>
                            </p>
                            <p className="col s2">
                                <label>
                                    <input
                                        name="height"
                                        type="radio"
                                        className="with-gap"
                                        checked={todo.todo_priority === 'height'}
                                        onChange={onChangeToDoPriority}
                                    />
                                    <span>Height</span>
                                </label>
                            </p>
                        </div>
                        <div className="row">
                            <p>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="completedCheckbox"
                                        onChange={onChangeTodoCompleted}
                                        checked={todo.todo_completed}
                                        value={todo.todo_completed}
                                    />
                                    <span>Completed</span>
                                </label>
                            </p>
                        </div>
                        <div className="row">
                            <button
                                className="btn waves-effect waves-light"
                                type="submit"
                                name="action"
                            >
                                Edit ToDo
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditTodo;