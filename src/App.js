import React from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom"
import 'materialize-css'
import Navigation from './components/Navigation'
import CreateTodo from './components/CreateTodo'
import TodosList from './components/TodoList'
import EditTodo from './components/EditTodo'

function App() {
  return (
    <Router>
        <div className="container">
          <Navigation/>
          <br/>
          <Route path="/" exact component={TodosList} />
          <Route path="/edit/:id" component={EditTodo} />
          <Route path="/create" component={CreateTodo} />
        </div>
    </Router>
  );
}

export default App;
