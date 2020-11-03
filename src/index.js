/* useEffect is a react hook which lets us run a function with "side-effects" (in this case, updating state after making an AJAX call) */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

/* We import getUsers from /.api to be able to make the AJAX call for the users inside our main application */
import { getUsers, getPostsByUser, getTodosByUser } from './api'

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import {
  Header,
  UserPosts,
  UserTodos
} from './components';

import {
  getCurrentUser
} from './auth';

/* DATA FLOW: */
    /* In main App coomponent, we initialize a piece of state called userList, and set it equal to empty array [] */
    /* App component calls the Header component, passing the userList along */
    /* We place the userList prop in the Header component */

    /* We use useState to make currentUser and setCurrentUser and pass them into the header */

    const App = () => {
    const [userList, setUserList] = useState([]);
    const [currentUser, setCurrentUser] = useState(getCurrentUser() );
    const [userPosts, setUserPosts] = useState([]);
    const [userTodos, setUserTodos] = useState([]);

    /* useEffect takes two main parameters: an effect function tht will be run, and an array of dependencies (state or props)  */

    /* useEffect has code thats run when the component is created. We call getUsers (API method), and in its callbacks we update the userList state based on the result (the effect) */

    /* The array of dependencies is a state or props you care about such that, if any of them change, we rerun the useEffect function (since it doesnt depend on any prop or state to be run)*/

    /* When App is created, that callback is run. When it comes back it updates the userList, and that update will cause <Header> to re-render since userList is one of its props*/ 



    useEffect(() => {
      getUsers()
        .then(users => {
          setUserList(users)
        })
        .catch(error => {
          // something something errors
          console.error(error);
        });
    }, []);

    /* Here we create a new state for the userPosts, and a new effect */
    /* Whenever the value of currentUser changes (via login/logout), we run this effect - we either */
      /* set userPosts to an empty array (if no currentUser) , or we make a call to the API and set userPosts to the return*/
      /* value of that if ther is a currentUser */

      /* Lastly we use conditional rendering to show the PostList component only if there is a currentUser set. */

      

    useEffect(() => {
      if (!currentUser) {
        setUserPosts([]);
        setUserTodos([]);
        return;
      }
  
      getPostsByUser(currentUser.id)
        .then(posts => {
          setUserPosts(posts);
        })
        .catch(error => {
          console.error(error)
        });

    getTodosByUser(currentUser.id)
      .then(todos => {
        setUserTodos(todos);
      })
      .catch(error => {
        console.error(error);
      });
  }, [currentUser]);

  return (
    <Router>
    <div id="App">
      <Header
        userList={ userList }
        currentUser={ currentUser }
        setCurrentUser={ setCurrentUser } />
      {
          currentUser
          ? <>
              <Switch>
                <Route path="/posts">
                  <UserPosts
                    userPosts={ userPosts }
                    currentUser={ currentUser } />
                </Route>
                <Route path="/todos">
                  <UserTodos
                    userTodos={ userTodos }
                    currentUser={ currentUser } />
                </Route>
                <Route exact path="/">
                  <h2 style={{
                    padding: ".5em"
                  }}>Welcome, { currentUser.username }!</h2>
                </Route>
                <Redirect to="/" />
              </Switch>
            </>
          : <>
              <Switch>
                <Route exact path="/">
                  <h2 style={{
                    padding: ".5em"
                  }}>Please log in, above.</h2>
                </Route>
                <Redirect to="/" />
              </Switch>
            </>
        }

    </div>
    </Router>
  );
}

/* we render both the UserPosts and UserTodos whenever anyone logs in. */

ReactDOM.render(
  <App />,
  document.getElementById('root')
);



/* REACT ROUTER
The next package we will use is called React Router. This comes with a number of existing components we can use in our application:

BrowserRouter, which we wrap the entire application with, enables routing for any components inside of it
Route which conditionally renders any children if the path matches its path attribute
Link and NavLink which provide a nice way to create links that work with our current router
Switch which provides a way to ensure we only match exactly one route */