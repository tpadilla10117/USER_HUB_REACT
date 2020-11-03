import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';


import {
  storeCurrentUser,
  clearCurrentUser
} from '../auth';

import './Header.css';


/* CONDITIONAL RENDERING NOTES: */
    /* We can interpolate any valid JS inside our JSX templates, you can use things like ternaries to add conditionals to templates
    
    EG.

    {
  isAdmin
  ? <AdminPanel />
  : <NonAdminPanel />
}


    Depending on the value of isAdmin, we will either create and render the AdminPanel or NonAdminPanel components.


    EG.

    {
  isAdmin
  ? <>
      <AdminPanel />
      <SecretAccess />
    </>
  : <NonAdminPanel />
}

    Each branch needs to follow the ONLY ONE ROOT rule, so to render multiple things, we can wrap them in a single root.  We use a dummy root pair, <></> in this case, but you can use a <div> etc

    */

/* Header component loops over the userList and builds the select dropdown */
/* At this PointerEvent, we need to get users into userList */

/* First we create a piece of local state for our form. Then, we create an effect that depends on the value of userList. This effect will run when the component is created, and will re-run when our App finishes its own effect.
 */

/* That second time will set the default selectedUser to the first one in our dropdown. */

/* Then, in our handleSelectChange we have updated the selectedUser to be the one whose id matches the value of the select change target. */

/* Lastly, depending on if a user is logging in or logging out we update the value of currentUser by calling setCurrentUser either on selectedUser or null. */

/* If you use the log in and log out features you should see that we can, in fact, update the value of currentUser and that the form updates accordingly. */

const Header = ({
  currentUser,
  setCurrentUser,
  userList 
}) => {
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    setSelectedUser(userList[0]);
  }, [userList]);

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  const handleSelectChange = (event) => {
    const id = event.target.value;
    const user = userList.find(user => user.id == id);
    setSelectedUser(user);
  }

  const handleUserLogin = (event) => {
    storeCurrentUser(selectedUser);
    setCurrentUser(selectedUser);
  }

  const handleUserLogout = (event) => {
    setSelectedUser(userList[0]);
    clearCurrentUser();
    setCurrentUser(null);
  }

  return (
    <header>
      <h1>Welcome to UserHub</h1>
      <form 
        className="user-select" 
        onSubmit={ handleSubmit } >
        {
          currentUser
          ? <> 
              <NavLink to="/posts" activeClassName="current">POSTS</NavLink>
              <NavLink to="/todos" activeClassName="current">TODOS</NavLink >
              <button onClick={ handleUserLogout }>LOG OUT, { currentUser.username }</button>
            </>
          : <>
              <select onChange={ handleSelectChange }>{
                userList.map(user => (
                  <option key={ user.id } value={ user.id }>
                    { user.username }
                  </option>
                ))
              }</select>
              <button onClick={ handleUserLogin }>LOG IN</button>
            </>
        }
      </form>
    </header>
  );
}

export default Header;