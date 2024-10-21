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
