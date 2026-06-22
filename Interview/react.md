# React Coding Interview Questions

A curated list of frequently asked React coding questions with answers and detailed explanations.

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Components & Props](#components--props)
3. [State & Lifecycle](#state--lifecycle)
4. [Hooks](#hooks)
5. [Performance Optimization](#performance-optimization)
6. [Context & State Management](#context--state-management)
7. [Coding Challenges](#coding-challenges)
8. [Tricky Questions](#tricky-questions)
9. [Advanced / Hard Questions](#advanced--hard-questions)

---

## Core Concepts

### Q1. What is the Virtual DOM and how does it work?

```jsx
// React creates a virtual representation of the UI
const element = <h1>Hello</h1>;
// Internally: { type: 'h1', props: { children: 'Hello' } }
```

**Explanation:** The **Virtual DOM** is a lightweight JavaScript representation of the real DOM. When state changes, React builds a new virtual tree, **diffs** it against the previous one (reconciliation), and computes the minimal set of real DOM updates. This is faster than directly manipulating the DOM for every change, which is slow and triggers reflows/repaints.

---

### Q2. What is JSX and how is it different from HTML?

```jsx
// JSX
const el = <div className="box" onClick={handleClick}>Hello {name}</div>;

// Compiles to:
const el = React.createElement(
  "div",
  { className: "box", onClick: handleClick },
  "Hello ", name
);
```

**Explanation:** **JSX** is a syntax extension that lets you write HTML-like markup in JavaScript. It's not HTML — it compiles to `React.createElement()` calls. Key differences: `className` instead of `class`, `htmlFor` instead of `for`, camelCase event handlers (`onClick`), `{}` for embedding JS expressions, and all tags must be closed.

---

### Q3. What is the difference between a controlled and uncontrolled component?

```jsx
// Controlled — React state is the source of truth
function Controlled() {
  const [value, setValue] = useState("");
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}

// Uncontrolled — DOM holds the state, accessed via ref
function Uncontrolled() {
  const inputRef = useRef();
  const handleSubmit = () => console.log(inputRef.current.value);
  return <input ref={inputRef} />;
}
```

**Explanation:** A **controlled component** has its value driven by React state — every keystroke updates state and re-renders. An **uncontrolled component** lets the DOM manage its own state, which you read via a `ref` when needed. Controlled is preferred for validation, conditional logic, and predictability; uncontrolled is simpler for basic forms and file inputs.

---

### Q4. What are keys in React and why are they important?

```jsx
// Bad: index as key (causes bugs on reorder/insert)
{items.map((item, index) => <li key={index}>{item.name}</li>)}

// Good: stable unique ID
{items.map(item => <li key={item.id}>{item.name}</li>)}
```

**Explanation:** **Keys** help React identify which list items changed, were added, or removed during reconciliation. They must be **stable, unique, and predictable**. Using array indices as keys causes bugs when the list reorders or items are inserted/deleted, because React mismatches elements with their state. Always prefer a unique ID.

---

## Components & Props

### Q5. What is the difference between props and state?

```jsx
function Child({ label }) {       // props: passed in, read-only
  const [count, setCount] = useState(0);  // state: internal, mutable
  return <button onClick={() => setCount(count + 1)}>{label}: {count}</button>;
}
```

**Explanation:** **Props** are passed from parent to child, are **read-only** (immutable within the child), and make components reusable. **State** is internal, mutable data managed within a component that triggers re-renders when changed. Props flow down (one-way data flow); state is local unless lifted up.

---

### Q6. How do you pass data from child to parent?

```jsx
function Parent() {
  const [message, setMessage] = useState("");
  return <Child onSend={setMessage} />;
}

function Child({ onSend }) {
  return <button onClick={() => onSend("Hello from child")}>Send</button>;
}
```

**Explanation:** Since data flows **one-way** (top-down), a child communicates upward by **calling a callback function** passed down as a prop. The parent defines the handler and updates its own state; the child invokes it with data. This is the standard "lifting state up" pattern.

---

### Q7. What is prop drilling and how do you avoid it?

```jsx
// Prop drilling — passing through intermediate components
<App user={user}>
  <Layout user={user}>
    <Header user={user} />  {/* only Header needs it */}

// Solution: Context API
const UserContext = createContext();
function App() {
  return (
    <UserContext.Provider value={user}>
      <Layout />
    </UserContext.Provider>
  );
}
function Header() {
  const user = useContext(UserContext);  // direct access
}
```

**Explanation:** **Prop drilling** is passing props through multiple intermediate components that don't use them, just to reach a deeply nested child. It's verbose and fragile. Solutions include the **Context API** (for global-ish data like theme/auth), component composition, or state management libraries (Redux, Zustand).

---

## State & Lifecycle

### Q8. What is the component lifecycle (with hooks)?

```jsx
function Component() {
  // Mount + Update
  useEffect(() => {
    console.log("runs after every render");
  });

  // Mount only
  useEffect(() => {
    console.log("runs once on mount");
    return () => console.log("cleanup on unmount");
  }, []);

  // Runs when `id` changes
  useEffect(() => {
    console.log("id changed");
  }, [id]);
}
```

**Explanation:** With hooks, `useEffect` replaces lifecycle methods. No dependency array = runs after **every** render (`componentDidUpdate`). Empty array `[]` = runs once on **mount** (`componentDidMount`), with the returned cleanup function running on **unmount** (`componentWillUnmount`). A dependency array runs the effect when those values change.

---

### Q9. Why is `setState` asynchronous and how do you handle it?

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);  // Both use stale count=0 → only +1!
    // Output: count becomes 1, not 2
  };

  const handleFixed = () => {
    setCount(prev => prev + 1);  // functional update
    setCount(prev => prev + 1);  // count becomes 2 ✓
  };
}
```

**Explanation:** State updates are **batched** and applied asynchronously for performance. Within one handler, `count` is a snapshot from that render, so multiple `setCount(count + 1)` calls use the same stale value. The fix is the **functional update form** `setCount(prev => prev + 1)`, which always receives the latest state.

---

### Q10. What happens when you call setState? (Re-render flow)

```jsx
function App() {
  const [count, setCount] = useState(0);
  console.log("render", count);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**Explanation:** Calling `setCount` schedules a re-render. React re-invokes the component function, computes the new virtual DOM, diffs it against the previous tree, and applies the minimal real-DOM changes. If the new state is **identical** (via `Object.is`) to the current one, React bails out and skips the re-render.

---

## Hooks

### Q11. What are the rules of hooks?

```jsx
// ❌ Wrong — conditional hook
function Bad({ show }) {
  if (show) {
    const [x, setX] = useState(0);  // breaks hook order!
  }
}

// ✅ Correct — top level, unconditional
function Good({ show }) {
  const [x, setX] = useState(0);
  if (show) { /* use x */ }
}
```

**Explanation:** The two rules: (1) **Only call hooks at the top level** — never inside loops, conditions, or nested functions, because React tracks hooks by **call order**. (2) **Only call hooks from React functions** (components or custom hooks). Breaking these corrupts the internal hook state mapping between renders.

---

### Q12. What is the difference between `useEffect`, `useLayoutEffect`, and `useMemo`?

```jsx
useEffect(() => {
  // runs AFTER paint — async, non-blocking
}, [dep]);

useLayoutEffect(() => {
  // runs BEFORE paint — synchronous, for DOM measurements
}, [dep]);

const expensive = useMemo(() => computeExpensive(a, b), [a, b]);
// memoizes a VALUE, recomputes only when deps change
```

**Explanation:** `useEffect` runs **after** the browser paints (non-blocking) — use for data fetching, subscriptions, most side effects. `useLayoutEffect` runs **synchronously before** paint — use only for DOM measurements/mutations to avoid visual flicker. `useMemo` caches a **computed value** between renders, recomputing only when dependencies change.

---

### Q13. What is the difference between `useMemo` and `useCallback`?

```jsx
// useMemo — memoizes a VALUE
const sortedList = useMemo(() => list.sort(), [list]);

// useCallback — memoizes a FUNCTION
const handleClick = useCallback(() => doSomething(id), [id]);

// useCallback(fn, deps) === useMemo(() => fn, deps)
```

**Explanation:** `useMemo` returns a **memoized value** (the result of a computation). `useCallback` returns a **memoized function** (the function itself). `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`. Both prevent unnecessary work/re-renders — `useCallback` is mainly used to keep function references stable when passing them to memoized child components.

---

### Q14. Write a custom hook for fetching data.

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => { if (!cancelled) setData(json); })
      .catch(err => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };  // cleanup prevents state update on unmounted component
  }, [url]);

  return { data, loading, error };
}

// Usage
function Profile({ userId }) {
  const { data, loading, error } = useFetch(`/api/users/${userId}`);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <h1>{data.name}</h1>;
}
```

**Explanation:** A **custom hook** extracts reusable stateful logic. `useFetch` encapsulates loading/error/data states and the fetch effect. The `cancelled` flag in the cleanup prevents the "Can't update state on unmounted component" warning when the component unmounts before the request finishes. The effect re-runs whenever `url` changes.

---

### Q15. Write a custom `useLocalStorage` hook.

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage
const [theme, setTheme] = useLocalStorage("theme", "light");
```

**Explanation:** This hook syncs state with `localStorage` so it **persists across reloads**. The lazy initializer (`useState(() => ...)`) reads from storage only once on mount. An effect writes back whenever the value changes. The API mirrors `useState`, making it a drop-in replacement.

---

### Q16. What is `useReducer` and when should you use it?

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "increment": return { count: state.count + 1 };
    case "decrement": return { count: state.count - 1 };
    case "reset":     return { count: 0 };
    default:          throw new Error("Unknown action");
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <>
      <span>{state.count}</span>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </>
  );
}
```

**Explanation:** `useReducer` manages state via a **reducer function** `(state, action) => newState`, similar to Redux. Prefer it over `useState` when state logic is **complex**, involves multiple sub-values, or when the next state depends on the previous. It centralizes update logic and makes state transitions predictable and testable.

---

## Performance Optimization

### Q17. What is `React.memo` and when should you use it?

```jsx
const Child = React.memo(function Child({ value }) {
  console.log("Child rendered");
  return <div>{value}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);
  // Child only re-renders if `value` prop changes
  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Child value="static" />
    </>
  );
}
```

**Explanation:** `React.memo` is a higher-order component that **memoizes** a component, skipping re-renders when its props are **shallowly equal** to the previous render. Use it for expensive components that receive the same props often. Caveat: it does a shallow comparison, so passing new object/function references each render defeats it (combine with `useMemo`/`useCallback`).

---

### Q18. How do you optimize a list of thousands of items?

```jsx
import { FixedSizeList } from "react-window";

function BigList({ items }) {
  return (
    <FixedSizeList height={500} itemCount={items.length} itemSize={35} width="100%">
      {({ index, style }) => <div style={style}>{items[index].name}</div>}
    </FixedSizeList>
  );
}
```

**Explanation:** **Virtualization** (windowing) renders only the items currently visible in the viewport plus a small buffer, instead of all thousands. Libraries like `react-window` or `react-virtualized` recycle DOM nodes as you scroll. This keeps the DOM small and scrolling smooth regardless of list size.

---

### Q19. What causes unnecessary re-renders and how do you prevent them?

```jsx
// Problem: new object/function every render breaks memoization
function Parent() {
  const [count, setCount] = useState(0);
  const config = { theme: "dark" };           // new object each render
  const handleClick = () => console.log("hi"); // new function each render
  return <Child config={config} onClick={handleClick} />;
}

// Fix
function Parent() {
  const [count, setCount] = useState(0);
  const config = useMemo(() => ({ theme: "dark" }), []);
  const handleClick = useCallback(() => console.log("hi"), []);
  return <Child config={config} onClick={handleClick} />;
}
```

**Explanation:** Common causes: parent re-renders cascade to children, **new object/array/function references** created each render, and unstable keys. Fixes include `React.memo` for children, `useMemo` for derived values/objects, `useCallback` for stable function references, and proper key usage. Only optimize when there's a measured performance problem.

---

## Context & State Management

### Q20. When should you use Context vs Redux vs local state?

```jsx
// Local state — component-specific
const [open, setOpen] = useState(false);

// Context — low-frequency global data (theme, auth, locale)
const ThemeContext = createContext();

// Redux/Zustand — complex, frequently-updated, shared app state
```

**Explanation:** Use **local state** for data only one component cares about. Use **Context** for low-frequency global values like theme, current user, or language (it re-renders all consumers on change, so avoid for fast-changing data). Use a **state library** (Redux, Zustand, Jotai) for complex, frequently-updated, app-wide state with middleware, devtools, and fine-grained subscriptions.

---

### Q21. What is the problem with Context and how do you optimize it?

```jsx
// Problem: any value change re-renders ALL consumers
<AppContext.Provider value={{ user, theme, settings }}>

// Fix 1: split into multiple contexts
<UserContext.Provider value={user}>
  <ThemeContext.Provider value={theme}>

// Fix 2: memoize the value object
const value = useMemo(() => ({ user, theme }), [user, theme]);
```

**Explanation:** When a Context's value changes, **all** consuming components re-render, even if they only use part of the value. Optimizations: (1) **split contexts** so consumers subscribe only to what they need; (2) **memoize the value object** so it doesn't change identity on every provider render; (3) use selector-based libraries for fine-grained updates.

---

## Coding Challenges

### Q22. Build a counter with increment, decrement, and reset.

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h2>{count}</h2>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={() => setCount(c => c - 1)}>−</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

**Explanation:** A classic warm-up. Note the **functional updates** `setCount(c => c + 1)` ensure correctness even with batched updates. The reset simply sets state back to the initial value.

---

### Q23. Build a search filter with debounce.

```jsx
function SearchList({ items }) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(timer);  // cancel on new keystroke
  }, [query]);

  const filtered = items.filter(item =>
    item.toLowerCase().includes(debounced.toLowerCase())
  );

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ul>{filtered.map(i => <li key={i}>{i}</li>)}</ul>
    </>
  );
}
```

**Explanation:** **Debouncing** delays filtering until the user stops typing for 300ms, avoiding expensive filtering on every keystroke. The effect sets a timer on each `query` change; the cleanup clears the previous timer, so only the final keystroke's timer survives. The list filters on the debounced value.

---

### Q24. Build a toggle / accordion component.

```jsx
function Accordion({ items }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <button onClick={() => setOpenId(openId === item.id ? null : item.id)}>
            {item.title}
          </button>
          {openId === item.id && <p>{item.content}</p>}
        </div>
      ))}
    </div>
  );
}
```

**Explanation:** We track a single `openId` so only one panel is open at a time. Clicking the open item's button toggles it closed (`null`); clicking another switches to it. Conditional rendering with `&&` shows the content only for the active item.

---

### Q25. Build a form with validation.

```jsx
function SignupForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (form.password.length < 6) errs.password = "Min 6 characters";
    return errs;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) console.log("Submit:", form);
  };

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={form.email} onChange={handleChange} />
      {errors.email && <span>{errors.email}</span>}
      <input name="password" type="password" value={form.password} onChange={handleChange} />
      {errors.password && <span>{errors.password}</span>}
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

**Explanation:** A controlled form using a single state object, with `[e.target.name]` computed property to update the right field generically. Validation runs on submit, populating an `errors` object; submission proceeds only if there are no errors. `e.preventDefault()` stops the native page reload.

---

## Tricky Questions

### Q26. What is the output? (Stale closure)

```jsx
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);  // BUG: always uses count=0
    }, 1000);
    return () => clearInterval(id);
  }, []);  // empty deps → closure captures initial count

  return <h1>{count}</h1>;  // stuck at 1
}
```

**Fix:**
```jsx
setInterval(() => setCount(c => c + 1), 1000);  // functional update
```

**Explanation:** The effect runs once with `count = 0` captured in the closure. The interval keeps calling `setCount(0 + 1)`, so the counter sticks at 1. This is the **stale closure** problem. The fix is the **functional update** `setCount(c => c + 1)`, which always reads the latest state regardless of the closure.

---

### Q27. Why does this infinite loop happen?

```jsx
function Component() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData([1, 2, 3]);  // sets state → re-render → effect runs again → ∞
  });  // ❌ no dependency array

  return <div>{data.length}</div>;
}
```

**Explanation:** Without a dependency array, `useEffect` runs after **every** render. The effect calls `setData`, which triggers a re-render, which runs the effect again — an **infinite loop**. The fix is to add an empty dependency array `[]` so the effect runs only once on mount.

---

### Q28. What is the output of this render order?

```jsx
function Parent() {
  console.log("Parent render");
  useEffect(() => console.log("Parent effect"));
  return <Child />;
}
function Child() {
  console.log("Child render");
  useEffect(() => console.log("Child effect"));
  return <div />;
}
// Output:
// Parent render
// Child render
// Child effect
// Parent effect
```

**Explanation:** React renders **top-down** (Parent then Child), but runs effects **bottom-up** (Child effect before Parent effect). This is because children must be fully mounted before the parent's effect runs, ensuring the parent can safely interact with mounted children (e.g., via refs).

---

### Q29. What is the difference between these two updates?

```jsx
// 1. Direct mutation — React won't re-render!
const [list, setList] = useState([1, 2, 3]);
list.push(4);
setList(list);  // same reference → bailout, no re-render

// 2. New reference — triggers re-render
setList([...list, 4]);  // ✓
```

**Explanation:** React uses `Object.is` to compare state. Mutating the existing array and passing the **same reference** makes React think nothing changed, so it skips the re-render. You must create a **new array/object** (`[...list, 4]`) so the reference differs. Immutability is fundamental to React state updates.

---

### Q30. Why shouldn't you use array index as a key?

```jsx
// Items: ["A", "B", "C"], keys: 0, 1, 2
// After removing "A": ["B", "C"], keys: 0, 1
// React thinks item 0 changed A→B, item 1 changed B→C, removed item 2
// → input state/focus gets mismatched

{items.map((item, i) => <input key={i} defaultValue={item} />)}
```

**Explanation:** When using index as key and the list reorders or items are inserted/removed, the index-to-item mapping shifts. React reuses DOM nodes based on keys, so component state (like input values, focus, or selection) attaches to the wrong items. Stable unique IDs keep each element correctly associated with its data.

---

## Advanced / Hard Questions

### Q31. Implement an Error Boundary.

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught:", error, errorInfo);  // log to service
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong: {this.state.error.message}</h1>;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary><BuggyComponent /></ErrorBoundary>
```

**Explanation:** **Error boundaries** catch JavaScript errors in their child component tree, log them, and show a fallback UI instead of crashing the whole app. They must be **class components** using `getDerivedStateFromError` (to render fallback) and `componentDidCatch` (to log). Note: they don't catch errors in event handlers, async code, or SSR — use try/catch for those.

---

### Q32. Explain reconciliation and the diffing algorithm.

```jsx
// React's heuristics:
// 1. Different element types → tear down and rebuild
<div> → <span>  // destroys div subtree, builds span fresh

// 2. Same type → keep node, update changed props
<div className="a" /> → <div className="b" />  // only updates className

// 3. Lists → use keys to match elements
```

**Explanation:** **Reconciliation** is how React updates the DOM efficiently. Instead of an O(n³) tree diff, React uses O(n) heuristics: (1) elements of **different types** produce different trees (full rebuild); (2) **same type** elements are kept and only changed attributes update; (3) **keys** match children across renders. These assumptions make diffing fast for typical UIs.

---

### Q33. What is `useImperativeHandle` and `forwardRef`?

```jsx
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = ""; },
  }));

  return <input ref={inputRef} {...props} />;
});

// Usage
function Parent() {
  const ref = useRef();
  return (
    <>
      <FancyInput ref={ref} />
      <button onClick={() => ref.current.focus()}>Focus</button>
    </>
  );
}
```

**Explanation:** `forwardRef` lets a component forward a `ref` to a child DOM node. `useImperativeHandle` customizes the **instance value** exposed to the parent ref, exposing a controlled API (like `focus`/`clear`) instead of the raw DOM node. Use sparingly — imperative escape hatches go against React's declarative model but are useful for focus management, animations, and integrating non-React code.

---

### Q34. Implement a debounce custom hook.

```jsx
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// Usage
function Search() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) fetch(`/api/search?q=${debouncedQuery}`);
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

**Explanation:** This hook returns a **debounced** version of a value that updates only after the value stops changing for `delay` ms. Each change resets the timer via the cleanup. It's cleaner than inline debouncing because the debounced value becomes a reactive dependency you can use in other effects (e.g., triggering an API call).

---

### Q35. What is `Suspense` and lazy loading?

```jsx
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./Dashboard"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Dashboard />
    </Suspense>
  );
}
```

**Explanation:** `React.lazy` enables **code splitting** by dynamically importing a component, so its bundle loads only when rendered — reducing initial load time. `Suspense` shows a `fallback` UI while the lazy component (or, with frameworks, data) is loading. This improves perceived performance for large apps by deferring non-critical code.

---

### Q36. How does the `key` prop affect component state preservation?

```jsx
// Changing key forces a full remount (resets state)
function Profile({ userId }) {
  return <UserDetails key={userId} userId={userId} />;
  // When userId changes, UserDetails unmounts + remounts fresh
}
```

**Explanation:** React uses `key` to decide whether to **reuse** or **remount** a component. If the key stays the same, state persists across renders. Changing the key makes React treat it as a **different component**, unmounting the old one (losing its state) and mounting a fresh instance. This is a useful trick to reset state when an identifier changes.

---

### Q37. Implement a `usePrevious` hook.

```jsx
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;  // updates AFTER render
  }, [value]);
  return ref.current;  // returns value from previous render
}

// Usage
function Counter() {
  const [count, setCount] = useState(0);
  const prev = usePrevious(count);
  return <p>Now: {count}, Before: {prev}</p>;
}
```

**Explanation:** This hook stores a value in a **ref**, which persists across renders without triggering re-renders. Because the effect runs **after** render, `ref.current` returned during render still holds the **previous** value; the effect then updates it for next time. Useful for comparing current vs previous props/state (e.g., detecting changes).

---

### Q38. What is the output? (Batching in React 18)

```jsx
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  const handleClick = () => {
    setCount(c => c + 1);
    setFlag(f => !f);
    // React 18: ONE re-render (automatic batching)
    // Even inside promises/timeouts/native events
  };

  console.log("render");
}
```

**Explanation:** In **React 18**, **automatic batching** groups multiple state updates into a single re-render — even inside promises, `setTimeout`, and native event handlers (which weren't batched before 18). So `handleClick` triggers just **one** re-render despite two `setState` calls. Use `flushSync` if you need to force a synchronous, separate update.

---

### Q39. Explain `useRef` use cases beyond DOM access.

```jsx
function Component() {
  const renderCount = useRef(0);
  const timerRef = useRef(null);

  renderCount.current++;  // mutable, persists, no re-render

  const start = () => {
    timerRef.current = setInterval(() => console.log("tick"), 1000);
  };
  const stop = () => clearInterval(timerRef.current);

  return <p>Renders: {renderCount.current}</p>;
}
```

**Explanation:** `useRef` creates a **mutable container** whose `.current` persists across renders **without** causing re-renders when changed. Beyond DOM access, it's used to: store mutable values (timer IDs, previous values, instance variables), avoid stale closures, count renders, and hold any value that should survive re-renders but isn't part of the rendered output.

---

### Q40. How do you prevent memory leaks in `useEffect`?

```jsx
useEffect(() => {
  let active = true;
  const controller = new AbortController();

  fetch(url, { signal: controller.signal })
    .then(res => res.json())
    .then(data => { if (active) setData(data); });

  const subscription = eventSource.subscribe(handler);

  return () => {
    active = false;
    controller.abort();        // cancel fetch
    subscription.unsubscribe(); // clean up subscription
  };
}, [url]);
```

**Explanation:** Memory leaks occur when a component unmounts but async work or subscriptions keep running and try to update state. The effect's **cleanup function** prevents this: cancel fetches (`AbortController`), unsubscribe from events/sockets, clear timers/intervals, and use a flag to skip state updates after unmount. Cleanup runs before re-running the effect and on unmount.

---

### Q41. What is the difference between SSR, CSR, and SSG?

```jsx
// CSR — Client-Side Rendering (plain React/Vite)
// Browser downloads JS, then renders. Blank HTML initially.

// SSR — Server-Side Rendering (Next.js getServerSideProps)
// Server renders HTML per request. Fast first paint, SEO-friendly.

// SSG — Static Site Generation (Next.js getStaticProps)
// HTML built at build time. Fastest, cached on CDN.
```

**Explanation:** **CSR** ships JavaScript that renders in the browser — simple but slow first paint and poor SEO. **SSR** renders HTML on the server per request — better SEO and faster first contentful paint, at higher server cost. **SSG** pre-renders pages at build time — fastest and CDN-cacheable, ideal for content that doesn't change per request. Frameworks like Next.js let you mix these per route.

---

### Q42. Implement a compound component pattern.

```jsx
const Tabs = ({ children, defaultIndex = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  return (
    <TabContext.Provider value={{ activeIndex, setActiveIndex }}>
      {children}
    </TabContext.Provider>
  );
};

const TabContext = createContext();
Tabs.List = ({ children }) => <div className="tab-list">{children}</div>;
Tabs.Tab = ({ index, children }) => {
  const { activeIndex, setActiveIndex } = useContext(TabContext);
  return (
    <button className={activeIndex === index ? "active" : ""}
            onClick={() => setActiveIndex(index)}>
      {children}
    </button>
  );
};
Tabs.Panel = ({ index, children }) => {
  const { activeIndex } = useContext(TabContext);
  return activeIndex === index ? <div>{children}</div> : null;
};

// Usage
<Tabs>
  <Tabs.List>
    <Tabs.Tab index={0}>Tab 1</Tabs.Tab>
    <Tabs.Tab index={1}>Tab 2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel index={0}>Content 1</Tabs.Panel>
  <Tabs.Panel index={1}>Content 2</Tabs.Panel>
</Tabs>
```

**Explanation:** The **compound component** pattern lets related components share implicit state via Context while giving consumers a flexible, declarative API. `Tabs` owns the active state; `Tabs.Tab`/`Tabs.Panel` consume it. This avoids prop drilling and prop explosion, producing readable JSX. It's the pattern behind libraries like Reach UI and Radix.

---

### Q43. What is the output? (Multiple state updates and closures)

```jsx
function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);       // queued with count=0 → 1
    setTimeout(() => {
      setCount(count + 1);     // closure captured count=0 → still 1
    }, 1000);
  };
  // After click: immediately 1, after 1s: still 1 (not 2)
}
```

**Explanation:** Both updates use the same `count` value (0) captured in the closure at click time. The synchronous `setCount` makes it 1. The delayed `setCount` also uses the stale `count = 0`, setting it to 1 again — not 2. Using `setCount(c => c + 1)` in both would correctly yield 2, since functional updates read the latest state.

---

### Q44. Implement an infinite scroll hook.

```jsx
function useInfiniteScroll(callback) {
  const observerRef = useRef();

  const lastElementRef = useCallback(node => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) callback();
    });
    if (node) observerRef.current.observe(node);
  }, [callback]);

  return lastElementRef;
}

// Usage
function List({ items, loadMore }) {
  const lastRef = useInfiniteScroll(loadMore);
  return items.map((item, i) => (
    <div key={item.id} ref={i === items.length - 1 ? lastRef : null}>
      {item.name}
    </div>
  ));
}
```

**Explanation:** Using the **IntersectionObserver API**, this hook calls `loadMore` when the **last element** scrolls into view. The callback ref attaches the observer to whichever node is currently last, disconnecting the previous observer first. This is more performant than scroll-event listeners since the observer fires only on visibility changes.

---

### Q45. What is `flushSync` and when do you need it?

```jsx
import { flushSync } from "react-dom";

function handleClick() {
  flushSync(() => {
    setCount(c => c + 1);  // forces synchronous DOM update
  });
  // DOM is now updated — safe to measure
  console.log(divRef.current.scrollHeight);
}
```

**Explanation:** `flushSync` forces React to **synchronously** flush state updates and update the DOM immediately, opting out of automatic batching. You need it rarely — when you must read the **updated DOM** right after a state change (e.g., measuring layout, managing scroll position, or focus). Overusing it hurts performance since it forces extra synchronous renders.

---

### Q46. Explain the difference between `useEffect` and event handlers for logic.

```jsx
// ❌ Don't sync derived state with effects
function Bad({ firstName, lastName }) {
  const [fullName, setFullName] = useState("");
  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);  // unnecessary!
  }, [firstName, lastName]);
}

// ✅ Compute during render
function Good({ firstName, lastName }) {
  const fullName = `${firstName} ${lastName}`;  // derived value
}
```

**Explanation:** A common mistake is using effects to compute **derived state** that can simply be calculated during render. Effects are for **synchronizing with external systems** (fetch, subscriptions, DOM, timers) — not for transforming props/state into other state. Computing during render is simpler, avoids an extra render, and stays in sync automatically. Use event handlers for user-triggered logic, effects for external sync.

---

### Q47. What is the output? (Conditional hooks bug)

```jsx
function Component({ show }) {
  if (show) {
    const [value, setValue] = useState(0);  // ❌ conditional hook
  }
  const [name, setName] = useState("");
  // Error: Rendered fewer hooks than expected / hook order changed
}
```

**Explanation:** Hooks must be called in the **same order every render** because React tracks them by call index, not name. Calling `useState` conditionally changes the hook count/order between renders when `show` toggles, corrupting React's internal state and throwing "Rendered fewer hooks than expected." Always call hooks unconditionally at the top level.

---

### Q48. Implement a theme switcher with Context.

```jsx
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggle = useCallback(
    () => setTheme(t => (t === "light" ? "dark" : "light")),
    []
  );
  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

// Usage
function Button() {
  const { theme, toggle } = useTheme();
  return <button onClick={toggle}>Theme: {theme}</button>;
}
```

**Explanation:** This provides a global theme via Context with a clean custom hook (`useTheme`) that also **guards** against usage outside the provider. The value is **memoized** (`useMemo`) so consumers don't re-render unless theme/toggle actually change, and `toggle` is stabilized with `useCallback`. Throwing on missing context catches setup mistakes early.

---

### Q49. What is the difference between `React.Fragment` and a wrapper div?

```jsx
// Wrapper div — adds extra DOM node
return <div><Child1 /><Child2 /></div>;

// Fragment — no extra DOM node
return <><Child1 /><Child2 /></>;
// or with key (in lists)
return <React.Fragment key={id}><Child1 /><Child2 /></React.Fragment>;
```

**Explanation:** A component must return a single root, but wrapping in a `div` adds an unnecessary DOM node that can break CSS layouts (flexbox/grid) and bloat the tree. **Fragments** (`<>...</>`) group children **without** adding a DOM element. Use the explicit `<React.Fragment key={...}>` form when you need a key (e.g., returning multiple elements in a list).

---

### Q50. Optimize a slow component with profiling.

```jsx
const ExpensiveList = React.memo(function ExpensiveList({ items, onSelect }) {
  const sorted = useMemo(
    () => [...items].sort((a, b) => a.value - b.value),
    [items]
  );
  return (
    <ul>
      {sorted.map(item => (
        <ListItem key={item.id} item={item} onSelect={onSelect} />
      ))}
    </ul>
  );
});

const ListItem = React.memo(({ item, onSelect }) => (
  <li onClick={() => onSelect(item.id)}>{item.name}</li>
));
```

**Explanation:** A systematic optimization combines several techniques: **`React.memo`** to skip re-renders when props are unchanged, **`useMemo`** to avoid re-sorting on every render, **stable callbacks** (`useCallback` in the parent for `onSelect`), and **stable keys**. Always measure first with the **React DevTools Profiler** to find actual bottlenecks before optimizing — premature optimization adds complexity without benefit.

---

## Quick Reference: Common Interview Topics

- **Fundamentals** — Virtual DOM, JSX, reconciliation, keys
- **Components** — props vs state, controlled/uncontrolled, composition
- **Hooks** — `useState`, `useEffect`, `useRef`, `useReducer`, `useContext`, custom hooks
- **Rules of hooks** — top-level only, React functions only
- **Performance** — `React.memo`, `useMemo`, `useCallback`, virtualization, code splitting
- **Common bugs** — stale closures, infinite loops, mutation, index-as-key
- **State management** — Context, Redux, lifting state up, prop drilling
- **Patterns** — compound components, render props, HOCs, error boundaries
- **React 18** — automatic batching, `Suspense`, `flushSync`, concurrent features
- **Rendering strategies** — CSR, SSR, SSG (Next.js)

---

*Happy coding and good luck with your interviews!*
