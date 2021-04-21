import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';

function CreateTodo() {
    const [todo, setTodo] = useState({
        todo_name: '',
        todo_description: '',
        todo_priority: '',
        todo_completed: false,
        todo_createdAt: '',
        todo_finishedAt: ''
    });

    const onChangeToDoName = (e) => {
        setTodo({ ...todo, todo_name: e.target.value })
    };

    const onChangeToDoDescription = (e) => {
        setTodo({ ...todo, todo_description: e.target.value })
    };

    const onChangeToDoPriority = (e) => {
        setTodo({ ...todo, todo_priority: e.target.name })
    };

    const onChangeStartDate = useCallback((e) => {
        setTodo((prev) => ({ ...prev, todo_createdAt: e }))
    }, []);

    const onChangeFinishDate = useCallback((e) => {
        setTodo((prev) => ({...prev, todo_finishedAt: e}))
    }, []);

    const onChangeDate = useCallback((e, elem) => {
        if(elem === 'started') {
            onChangeStartDate(e);
        } else {
            onChangeFinishDate(e)
        }
    }, [onChangeStartDate, onChangeFinishDate])

    const clear = () => {
        setTodo({
            todo_name: '',
            todo_description: '',
            todo_priority: '',
            todo_completed: false,
            todo_createdAt: '',
            todo_finishedAt: ''    
        });
    }

    useEffect(() => {
        let elem = document.querySelectorAll(".datepicker");
        elem.forEach((el) => {
          window.M.Datepicker.init(el, {
            firstDay: 1,
            format: "ddd dd mmm yyyy",
            minDate: new Date(),
            autoClose: true,
            onSelect: (evt) => {
              onChangeDate(evt, el.name)
            },
          });
        });
      }, [onChangeDate]);


    const onSubmit = async (e) => {
        e.preventDefault();
        const newTodo = {...todo};

        let isFormValid = true;
        const { todo_createdAt, todo_finishedAt } = newTodo;
        const isDateValid = (todo_finishedAt && todo_createdAt > todo_finishedAt) ? false : true;

        console.log(todo_createdAt, todo_finishedAt);

        for(let key in newTodo) {
            const excludingKeys = key !== 'todo_createdAt' && key !== 'todo_finishedAt';
            const emptyKeys = newTodo[key] === null || newTodo[key] === "";

            if (emptyKeys && excludingKeys) {
                isFormValid = false;
            }
          }

          if (isFormValid && isDateValid) {
            try {
                await axios.post('http://localhost:4000/todos/add', newTodo)
                window.M.toast({html: `todo added successfully`})
                setTodo({ ...todo, ...e })
                clear();
            } catch(e) {
                window.M.toast({html: `adding new todo failed`})
                console.log(e)
            }
          } else {
            !isFormValid && window.M.toast({ html: "All fields must be filled" });
            !isDateValid && window.M.toast({ html: "Start date can't be earlyer finish date" });
          }
    }

    return (
        <div>
            <div style={{ marginTop: 10 }}>
                <h3>Create New Todo</h3>
                <div className="container row">
                    <form action="" className="col s12" onSubmit={onSubmit}>
                        <div className="row">
                            <div className="input-field col s6">
                                <input
                                    type="text"
                                    className="datepicker"
                                    id="started"
                                    name="started"
                                    onSelect={onChangeStartDate}
                                />
                                <label htmlFor="started">Todo started</label>
                            </div>
                            <div className="input-field col s6">
                                <input
                                    type="text"
                                    className="datepicker"
                                    id="finished"
                                    name="finished"
                                    onSelect={onChangeFinishDate}
                                />
                                <label htmlFor="started">Todo finished</label>
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
                                <label htmlFor="name">ToDo Name</label>
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
                                <label htmlFor="description">ToDo Description</label>
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
                            <button
                                className="btn waves-effect waves-light"
                                type="submit"
                                name="action"
                            >
                                Create ToDo
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateTodo;