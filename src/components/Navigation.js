import React from 'react'
import { NavLink, useLocation } from "react-router-dom"

function Navigation() {
  const location = useLocation();

  const { pathname } = location;

  return (
          <nav>
           <div className="nav-wrapper indigo lighten-5">
            <NavLink to="/" className="brand-logo black-text">Simple ToDo</NavLink>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                  <li className={pathname === '/' ? 'active' : ''}>
                    <NavLink to="/" className="nav-link black-text">Todos</NavLink>
                  </li>
                  <li className={pathname === '/create' ? 'active' : ''}>
                    <NavLink to="/create" className="nav-link black-text">Create Todo</NavLink>
                  </li>
                </ul>
           </div>
          </nav>
  );
}

export default Navigation;
