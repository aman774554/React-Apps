The Context API in React is a feature that allows you to share data globally across your component tree
without having to pass props down manually at every level. It's designed to solve the problem of "prop
drilling", where data has to be passed through many layers of components unnecessarily.

Key Concepts of the Context API
Context Provider (<Provider />):

The Provider component makes the context data available to all components within its subtree. It "provides" the data to child components.
You pass a value prop to the Provider, which will be the shared data.
Context Consumer (useContext Hook or <Consumer />):

A Consumer is a component that subscribes to the context and receives the context data. It can access the context values provided by the nearest Provider.
In function components, the useContext hook is typically used to consume context values.
Creating a Context:

You create a context using the React.createContext() method. It returns two components: Provider and Consumer.
====================================================================================================================
  
  Creating a Context:
--------------------------
  import React, { createContext } from 'react';

// Create a context object
const MyContext = createContext();

Setting Up a Provider:
--------------------------------
  function App() {
  return (
    <MyContext.Provider value={{ user: 'John Doe', isLoggedIn: true }}>
      <UserProfile />
    </MyContext.Provider>
  );
}

Consuming Context with useContext (in functional components):
------------------------------------------------------------------
  import { useContext } from 'react';
import MyContext from './MyContext';  // Import the context object

function UserProfile() {
  const { user, isLoggedIn } = useContext(MyContext);

  return (
    <div>
      <h1>User: {user}</h1>
      <p>Status: {isLoggedIn ? 'Logged In' : 'Logged Out'}</p>
    </div>
  );
}


