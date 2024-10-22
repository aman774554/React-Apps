==========================================================================================================================================
  useCallback:-
==========================================================================================================================================
    
In React, useCallback is a hook that helps you optimize the performance of your components by memoizing (i.e., caching) a callback function.
This means that React will return the same instance of the function if the dependencies you provide haven't changed, preventing
unnecessary re-creations of the function on every render.

  const memoizedCallback = useCallback(() => {
  // Your callback logic here
}, [dependency1, dependency2]);

=====================================================================================================================================================
  LazyLoading:-
=====================================================================================================================================================
  
 React Lazy Loading is a technique in React that allows you to load components only when they are needed, rather than loading them all upfront.
 This improves the initial load time of the app,making it faster and more efficient by reducing the amount of JavaScript that needs to be downloaded
 and executed when the app first loads.

const LazyComponent = React.lazy(() => import('./MyComponent'));

function App() {
  return (
    <div>
      <React.Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </React.Suspense>
    </div>
  );
}
===============================================================================
  
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Home = lazy(() => import('./Home'));
const About = lazy(() => import('./About'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
        </Switch>
      </Suspense>
    </Router>
  );
}

#When to Use Lazy Loading:
Large Applications: When you have a large app with multiple routes or sections that load big components.
Component-Level Splitting: You want to break your application into smaller bundles for better performance.
Route-Based Loading: Using lazy loading for route components in a Single Page Application (SPA), where components are loaded only when a specific route is visited.

==========================================================================================================================================
  useMemo:-
==========================================================================================================================================
  In React, useMemo is a hook that allows you to memoize the result of a computation so that it is only recalculated when its dependencies
  change. It is mainly used for performance optimization to prevent expensive or unnecessary computations during renders.

    const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

==========================================================================================================================================
  React.Memo:-
==========================================================================================================================================
  React.memo is a higher-order component (HOC) in React that optimizes the performance of functional components by preventing unnecessary re-renders.
  It works by memoizing a component, meaning it will only re-render when its props change. This can improve the performance of components that receive 
  the same props frequently but don’t need to re-render every time.
    
--> How React.memo Works:
When you wrap a functional component with React.memo, React will compare the previous props with the new props (using shallow comparison) and will only
trigger a re-render if the props have changed.

  const MyComponent = React.memo(({ name }) => {
  console.log("Component re-rendered");
  return <div>{name}</div>;
});

function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <MyComponent name="John" />
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default App;

==============================================================================
  useParam & useNavigate
==============================================================================
  
<Route path="/users/:userId" component={UserDetails} />

function UserDetails() {
  const { userId } = useParams(); // Extracts the userId from the URL

  return <div>User ID: {userId}</div>;
}

-----------------------------------------

const navigate = useNavigate();
navigate('/path');  // To navigate to another route
navigate(-1);       // Equivalent to history.goBack()

------------------------------------------
  
import React from 'react';
import { useLocation } from 'react-router-dom';

    const location = useLocation(); // This provides the current URL and path details

    return (
        <div>
            <h3>Current Path: {location.pathname}</h3>
            <p>Full URL: {location.href}</p>
            <p>Search Params: {location.search}</p>
        </div>
    );
