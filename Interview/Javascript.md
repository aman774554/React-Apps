# JavaScript Coding Interview Questions

A curated list of frequently asked JavaScript coding questions with answers and detailed explanations.

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Closures](#closures)
3. [Hoisting](#hoisting)
4. [`this` Keyword](#this-keyword)
5. [Asynchronous JavaScript](#asynchronous-javascript)
6. [Prototypes & Inheritance](#prototypes--inheritance)
7. [Arrays & Objects](#arrays--objects)
8. [Coding Challenges](#coding-challenges)
9. [Tricky Output Questions](#tricky-output-questions)
10. [Advanced / Hard Questions](#advanced--hard-questions)

---

## Core Concepts

### Q1. What is the difference between `var`, `let`, and `const`?

| Feature | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function | Block | Block |
| Hoisting | Yes (initialized as `undefined`) | Yes (in TDZ) | Yes (in TDZ) |
| Re-declaration | Allowed | Not allowed | Not allowed |
| Re-assignment | Allowed | Allowed | Not allowed |

```js
function test() {
  if (true) {
    var a = 1;   // function scoped
    let b = 2;   // block scoped
    const c = 3; // block scoped
  }
  console.log(a); // 1
  console.log(b); // ReferenceError
}
```

**Explanation:** `var` is function-scoped and gets hoisted with an initial value of `undefined`. `let` and `const` are block-scoped and live in the **Temporal Dead Zone (TDZ)** until declared, so accessing them before declaration throws a `ReferenceError`. `const` must be initialized at declaration and cannot be reassigned (though objects/arrays it points to can still be mutated).

---

### Q2. What is the difference between `==` and `===`?

```js
console.log(2 == "2");   // true  (type coercion)
console.log(2 === "2");  // false (no coercion)
console.log(null == undefined);  // true
console.log(null === undefined); // false
console.log(NaN === NaN);        // false
```

**Explanation:** `==` (loose equality) performs **type coercion** before comparing, converting operands to the same type. `===` (strict equality) compares both **value and type** without coercion. Best practice is to always use `===` to avoid unexpected coercion bugs. According to the IEEE 754 floating-point standard (which JavaScript follows), any comparison involving NaN returns false.

---

### Q3. What is the difference between `null` and `undefined`?

```js
let a;
console.log(a);          // undefined (declared but not assigned)
let b = null;
console.log(b);          // null (intentional absence of value)

console.log(typeof undefined); // "undefined"
console.log(typeof null);      // "object" (historical bug in JS)
```

**Explanation:** `undefined` means a variable has been declared but **not assigned** a value. `null` is an **intentional** assignment representing "no value". `typeof null` returns `"object"`, which is a long-standing bug in JavaScript that remains for backward compatibility.

---

## Closures

### Q4. What is a closure? Give an example.

```js
function counter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}

const increment = counter();
console.log(increment()); // 1
console.log(increment()); // 2
console.log(increment()); // 3
```

**Explanation:** A **closure** is a function that remembers and accesses variables from its **lexical scope** even after the outer function has finished executing. Here, the inner function "closes over" the `count` variable, keeping it alive in memory across calls. Closures are commonly used for data privacy, function factories, and maintaining state.

---

### Q5. Fix this classic loop closure bug.

```js
// Problem
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3
```

**Solution 1 — use `let`:**
```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2
```

**Solution 2 — IIFE with `var`:**
```js
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(() => console.log(j), 100);
  })(i);
}
// Output: 0, 1, 2
```

**Explanation:** With `var`, all callbacks share the **same** `i` (function-scoped), and by the time `setTimeout` fires, the loop has finished and `i === 3`. Using `let` creates a **new binding of `i` per iteration** (block-scoped). The IIFE solution captures the current value of `i` as a parameter `j` in a new scope.

---

## Hoisting

### Q6. Explain hoisting with this example.

```js
console.log(x); // undefined
var x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;

foo();          // "Hello" — works
function foo() { console.log("Hello"); }

bar();          // TypeError: bar is not a function
var bar = function () { console.log("Hi"); };
```

**Explanation:** **Hoisting** moves declarations to the top of their scope during compilation. `var` declarations are hoisted and initialized to `undefined`. `let`/`const` are hoisted but kept in the TDZ (uninitialized). **Function declarations** are fully hoisted (body included), so they can be called before definition. **Function expressions** assigned to `var` are only hoisted as `undefined`, so calling them early throws a `TypeError`.

---

## `this` Keyword

### Q7. What does `this` refer to in different contexts?

```js
// 1. Global context
console.log(this); // window (browser) / {} (Node module)

// 2. Object method
const obj = {
  name: "JS",
  greet() { return this.name; }
};
console.log(obj.greet()); // "JS"

// 3. Regular function (non-strict)
function show() { return this; }
console.log(show()); // window / global

// 4. Arrow function — inherits `this` from enclosing scope
const obj2 = {
  name: "JS",
  greet: () => this.name
};
console.log(obj2.greet()); // undefined
```

**Explanation:** The value of `this` depends on **how a function is called**, not where it's defined. In a method, `this` is the object before the dot. In a standalone function call, `this` is the global object (or `undefined` in strict mode). **Arrow functions** don't have their own `this` — they inherit it lexically from the surrounding scope, which is why they're great for callbacks but bad as object methods.

---

### Q8. Implement your own `bind`, `call`, and `apply`.

```js
// call
Function.prototype.myCall = function (context, ...args) {
  context = context || globalThis;
  const fn = Symbol();
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
};

// apply
Function.prototype.myApply = function (context, args = []) {
  context = context || globalThis;
  const fn = Symbol();
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
};

// bind
Function.prototype.myBind = function (context, ...args) {
  const self = this;
  return function (...newArgs) {
    return self.apply(context, [...args, ...newArgs]);
  };
};

// Usage
function greet(greeting) { return `${greeting}, ${this.name}`; }
const user = { name: "Alice" };
console.log(greet.myCall(user, "Hi"));   // "Hi, Alice"
console.log(greet.myApply(user, ["Hey"])); // "Hey, Alice"
console.log(greet.myBind(user)("Hello"));  // "Hello, Alice"
```

**Explanation:** `call` and `apply` invoke a function **immediately** with an explicit `this`; the difference is `call` takes comma-separated args while `apply` takes an array. `bind` returns a **new function** with `this` permanently bound. We implement them by temporarily attaching the function to the context object (using a `Symbol` key to avoid collisions), invoking it, then cleaning up.

---

## Asynchronous JavaScript

### Q9. Explain the output order (Event Loop).

```js
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");

// Output: 1, 4, 3, 2
```

**Explanation:** JavaScript runs **synchronous** code first (`1`, `4`). Then it processes the **microtask queue** (Promises — `3`) before the **macrotask queue** (`setTimeout` — `2`). Microtasks always run before the next macrotask, which is why `3` prints before `2` even though both are async.

---

### Q10. What is the difference between Promises, callbacks, and async/await?

```js
// Callback (callback hell)
getData(function (a) {
  getMore(a, function (b) {
    getEvenMore(b, function (c) {
      console.log(c);
    });
  });
});

// Promise chaining
getData()
  .then(a => getMore(a))
  .then(b => getEvenMore(b))
  .then(c => console.log(c))
  .catch(err => console.error(err));

// async/await (cleanest)
async function run() {
  try {
    const a = await getData();
    const b = await getMore(a);
    const c = await getEvenMore(b);
    console.log(c);
  } catch (err) {
    console.error(err);
  }
}
```

**Explanation:** **Callbacks** lead to deeply nested "callback hell". **Promises** flatten the structure with `.then()` chaining and centralized `.catch()` error handling. **async/await** is syntactic sugar over Promises that makes asynchronous code read like synchronous code, with `try/catch` for errors. All three handle the same async operations; async/await is generally the most readable.

---

### Q11. Implement `Promise.all` from scratch.

```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;

    if (promises.length === 0) return resolve(results);

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then(value => {
          results[index] = value;
          completed++;
          if (completed === promises.length) resolve(results);
        })
        .catch(reject);
    });
  });
}

// Usage
promiseAll([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)])
  .then(console.log); // [1, 2, 3]
```

**Explanation:** `Promise.all` resolves when **all** input promises resolve, returning an array of results **in order**, or rejects immediately if **any** promise rejects. We track completion count and store each result at its original index (preserving order regardless of resolution timing). The first rejection triggers `reject`.

---

## Prototypes & Inheritance

### Q12. Explain prototypal inheritance.

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

function Dog(name) {
  Animal.call(this, name); // inherit properties
}
Dog.prototype = Object.create(Animal.prototype); // inherit methods
Dog.prototype.constructor = Dog;
Dog.prototype.speak = function () {
  return `${this.name} barks`;
};

const d = new Dog("Rex");
console.log(d.speak()); // "Rex barks"
console.log(d instanceof Animal); // true
```

**Explanation:** JavaScript uses **prototypal inheritance**: objects inherit directly from other objects via the **prototype chain**. When you access a property, JS looks on the object, then its prototype, and up the chain until found or `null`. Here `Dog` inherits properties via `Animal.call(this)` and methods by setting its prototype to an object created from `Animal.prototype`.

---

### Q13. What is the difference between `Object.create` and `class`?

```js
// ES6 class (syntactic sugar)
class Person {
  constructor(name) { this.name = name; }
  greet() { return `Hi, ${this.name}`; }
}

// Object.create
const personProto = {
  greet() { return `Hi, ${this.name}`; }
};
const p = Object.create(personProto);
p.name = "Bob";
```

**Explanation:** ES6 `class` is **syntactic sugar** over prototypal inheritance — under the hood it still uses prototypes. `Object.create(proto)` creates a new object with the specified prototype directly. Classes provide cleaner syntax, `constructor`, `extends`, `super`, and private fields, but the underlying mechanism is identical.

---

## Arrays & Objects

### Q14. Implement `map`, `filter`, and `reduce`.

```js
// map
Array.prototype.myMap = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this));
  }
  return result;
};

// filter
Array.prototype.myFilter = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) result.push(this[i]);
  }
  return result;
};

// reduce
Array.prototype.myReduce = function (callback, initial) {
  let acc = initial;
  let startIndex = 0;
  if (acc === undefined) {
    acc = this[0];
    startIndex = 1;
  }
  for (let i = startIndex; i < this.length; i++) {
    acc = callback(acc, this[i], i, this);
  }
  return acc;
};

// Usage
console.log([1, 2, 3].myMap(x => x * 2));        // [2, 4, 6]
console.log([1, 2, 3, 4].myFilter(x => x % 2));  // [1, 3]
console.log([1, 2, 3, 4].myReduce((a, b) => a + b, 0)); // 10
```

**Explanation:** `map` transforms each element and returns a **new array** of the same length. `filter` returns a new array with only elements passing the test. `reduce` accumulates all elements into a single value using an accumulator. All three are non-mutating higher-order functions. Note how `reduce` handles the optional initial value.

---

### Q15. How do you deep clone an object?

```js
const obj = { a: 1, b: { c: 2 }, d: [3, 4] };

// 1. structuredClone (modern, built-in)
const clone1 = structuredClone(obj);

// 2. JSON (loses functions, dates, undefined)
const clone2 = JSON.parse(JSON.stringify(obj));

// 3. Recursive custom function
function deepClone(value) {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(deepClone);
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [k, deepClone(v)])
  );
}
const clone3 = deepClone(obj);
```

**Explanation:** A **shallow copy** (`{...obj}` or `Object.assign`) only copies top-level properties; nested objects remain shared references. A **deep clone** recursively copies all levels. `structuredClone()` is the modern built-in solution. The JSON method is simple but loses functions, `undefined`, `Date` objects, and circular references.

---

### Q16. What is the difference between shallow and deep copy?

```js
const original = { name: "A", nested: { value: 1 } };

// Shallow copy
const shallow = { ...original };
shallow.nested.value = 99;
console.log(original.nested.value); // 99 — original mutated!

// Deep copy
const deep = structuredClone(original);
deep.nested.value = 50;
console.log(original.nested.value); // 99 — original safe
```

**Explanation:** A **shallow copy** duplicates only the first level; nested objects are shared by reference, so mutating them affects the original. A **deep copy** recursively duplicates every level, fully isolating the copy from the original.

---

## Coding Challenges

### Q17. Reverse a string (multiple ways).

```js
// Built-in
const reverse1 = str => str.split("").reverse().join("");

// Loop
function reverse2(str) {
  let result = "";
  for (let i = str.length - 1; i >= 0; i--) result += str[i];
  return result;
}

// Recursion
const reverse3 = str => str === "" ? "" : reverse3(str.slice(1)) + str[0];

console.log(reverse1("hello")); // "olleh"
```

---

### Q18. Check if a string is a palindrome.

```js
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === cleaned.split("").reverse().join("");
}

console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("hello")); // false
```

**Explanation:** We normalize the string (lowercase, strip non-alphanumeric characters), then compare it with its reverse. If they match, it's a palindrome.

---

### Q19. Find duplicates in an array.

```js
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of arr) {
    if (seen.has(item)) duplicates.add(item);
    else seen.add(item);
  }
  return [...duplicates];
}

console.log(findDuplicates([1, 2, 2, 3, 4, 4, 5])); // [2, 4]
```

**Explanation:** Using a `Set` to track seen elements gives **O(n)** time complexity. When we encounter an element already in `seen`, we add it to `duplicates`. The result `Set` automatically handles repeated duplicates.

---

### Q20. Implement Debounce.

```js
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Usage: only fires after user stops typing for 300ms
const handleSearch = debounce(query => console.log("Searching:", query), 300);
```

**Explanation:** **Debounce** delays a function's execution until after a specified time has passed since the **last** call. Each new call resets the timer. It's useful for search inputs, window resize, and scroll events to limit how often expensive operations run.

---

### Q21. Implement Throttle.

```js
function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Usage: fires at most once every 1000ms
const handleScroll = throttle(() => console.log("Scrolled"), 1000);
```

**Explanation:** **Throttle** ensures a function runs at most **once per time interval**, regardless of how many times it's called. Unlike debounce (which waits for inactivity), throttle guarantees regular execution. Great for scroll, resize, and mousemove events.

---

### Q22. Flatten a nested array.

```js
// Built-in
const flat1 = arr => arr.flat(Infinity);

// Recursive
function flatten(arr) {
  return arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val),
    []
  );
}

console.log(flatten([1, [2, [3, [4]], 5]])); // [1, 2, 3, 4, 5]
```

**Explanation:** Flattening converts a nested array into a single-level array. The built-in `flat(Infinity)` handles any depth. The recursive version checks each element: if it's an array, recurse; otherwise, add it to the accumulator.

---

### Q23. Implement a memoization function.

```js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const slowSquare = n => { for (let i = 0; i < 1e6; i++); return n * n; };
const fastSquare = memoize(slowSquare);
console.log(fastSquare(5)); // computed
console.log(fastSquare(5)); // cached (instant)
```

**Explanation:** **Memoization** caches the results of expensive function calls keyed by their arguments. On repeated calls with the same inputs, it returns the cached result instead of recomputing. This trades memory for speed and is a core dynamic-programming optimization.

---

### Q24. Implement currying.

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...next) => curried.apply(this, [...args, ...next]);
  };
}

function add(a, b, c) { return a + b + c; }
const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
```

**Explanation:** **Currying** transforms a function with multiple arguments into a sequence of functions each taking one (or some) argument. We keep collecting arguments until we have enough (`fn.length`), then invoke the original function. This enables partial application and reusable specialized functions.

---

## Tricky Output Questions

### Q25. What is the output?

```js
console.log(0.1 + 0.2 === 0.3); // false
console.log(0.1 + 0.2);         // 0.30000000000000004
```

**Explanation:** Floating-point numbers are stored in **binary (IEEE 754)**, and `0.1` and `0.2` cannot be represented exactly, causing tiny rounding errors. To compare, use a small epsilon: `Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON`.

---

### Q26. What is the output?

```js
console.log([] + []);     // "" (empty string)
console.log([] + {});     // "[object Object]"
console.log({} + []);     // "[object Object]" or 0 (context-dependent)
console.log([1, 2] + [3, 4]); // "1,23,4"
```

**Explanation:** The `+` operator coerces arrays/objects to **strings**. `[]` becomes `""`, `{}` becomes `"[object Object]"`, and arrays become comma-joined strings. There's no array concatenation with `+`; it's all string coercion.

---

### Q27. What is the output?

```js
const arr = [1, 2, 3];
arr[10] = 11;
console.log(arr.length); // 11
console.log(arr);        // [1, 2, 3, <7 empty>, 11]
```

**Explanation:** Setting an index beyond the array length creates a **sparse array** with empty slots. The `length` becomes `index + 1` (11), but the gaps are "empty" (not `undefined` values), which behave differently in iteration methods.

---

### Q28. What is the output?

```js
let a = { x: 1 };
let b = a;
b.x = 2;
console.log(a.x); // 2

let c = 1;
let d = c;
d = 2;
console.log(c); // 1
```

**Explanation:** Objects are assigned by **reference** — `a` and `b` point to the same object, so mutating through `b` affects `a`. Primitives (numbers, strings, booleans) are assigned by **value** — `d` gets a copy, so reassigning it doesn't affect `c`.

---

### Q29. What is the output?

```js
console.log(typeof typeof 1); // "string"
```

**Explanation:** `typeof 1` returns the string `"number"`. Then `typeof "number"` returns `"string"`. So the result is `"string"`.

---

### Q30. What is the output?

```js
(function () {
  var a = b = 5;
})();

console.log(typeof a); // "undefined"
console.log(typeof b); // "number" (b leaked to global!)
```

**Explanation:** `var a = b = 5` is evaluated as `b = 5; var a = b;`. Here `b` is assigned **without** `var`/`let`/`const`, so in non-strict mode it becomes an **implicit global**. `a` is function-scoped and not accessible outside. This is a classic pitfall — always use `"use strict"` to catch it.

---

## Advanced / Hard Questions

### Q31. Implement `Promise.race`, `Promise.any`, and `Promise.allSettled`.

```js
// race — settles with the first promise to settle (resolve OR reject)
function race(promises) {
  return new Promise((resolve, reject) => {
    for (const p of promises) Promise.resolve(p).then(resolve, reject);
  });
}

// any — resolves with first fulfilled; rejects only if ALL reject
function any(promises) {
  return new Promise((resolve, reject) => {
    let rejectedCount = 0;
    const errors = [];
    promises.forEach((p, i) => {
      Promise.resolve(p).then(resolve, err => {
        errors[i] = err;
        rejectedCount++;
        if (rejectedCount === promises.length)
          reject(new AggregateError(errors, "All promises were rejected"));
      });
    });
  });
}

// allSettled — waits for all, never rejects
function allSettled(promises) {
  return Promise.all(
    promises.map(p =>
      Promise.resolve(p).then(
        value => ({ status: "fulfilled", value }),
        reason => ({ status: "rejected", reason })
      )
    )
  );
}
```

**Explanation:** `race` settles as soon as the **first** promise settles (whether it resolves or rejects). `any` resolves with the first **fulfilled** value and only rejects (with an `AggregateError`) if **every** promise rejects. `allSettled` always resolves with an array describing each outcome (`fulfilled`/`rejected`) and never short-circuits.

---

### Q32. Implement a deep clone that handles circular references.

```js
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== "object") return value;
  if (value instanceof Date) return new Date(value);
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);
  if (seen.has(value)) return seen.get(value); // circular reference

  const clone = Array.isArray(value) ? [] : {};
  seen.set(value, clone);

  for (const key of Reflect.ownKeys(value)) {
    clone[key] = deepClone(value[key], seen);
  }
  return clone;
}

const obj = { a: 1 };
obj.self = obj; // circular
const copy = deepClone(obj);
console.log(copy.self === copy); // true (no infinite loop)
```

**Explanation:** A naive recursive clone infinitely loops on circular references. We use a `WeakMap` to remember already-cloned objects: before recursing we store the new clone, so when we revisit the same source object we return the existing clone. We also special-case `Date` and `RegExp`, which the generic object loop wouldn't copy correctly.

---

### Q33. Implement an `EventEmitter` (pub/sub) class.

```js
class EventEmitter {
  constructor() { this.events = {}; }

  on(event, listener) {
    (this.events[event] ||= []).push(listener);
    return this;
  }

  off(event, listener) {
    this.events[event] = (this.events[event] || []).filter(l => l !== listener);
    return this;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  emit(event, ...args) {
    (this.events[event] || []).forEach(l => l(...args));
    return this;
  }
}

const bus = new EventEmitter();
bus.on("data", x => console.log("Got:", x));
bus.emit("data", 42); // "Got: 42"
```

**Explanation:** The **publish/subscribe** pattern decouples producers and consumers. `on` registers listeners, `off` removes them, `once` auto-removes after the first call (via a wrapper), and `emit` invokes all listeners for an event with the given arguments. This is the core of Node's `EventEmitter` and many front-end state libraries.

---

### Q34. What will this output and why? (`async`/`await` ordering)

```js
async function async1() {
  console.log("A");
  await async2();
  console.log("B");
}
async function async2() {
  console.log("C");
}

console.log("D");
async1();
console.log("E");

// Output: D, A, C, E, B
```

**Explanation:** Synchronous code runs first: `D`. Calling `async1()` runs synchronously until the `await` — printing `A`, then `async2()` prints `C`. Everything **after** `await` (`console.log("B")`) is queued as a **microtask**, so control returns to the caller and prints `E`. Once the synchronous stack clears, the microtask runs: `B`.

---

### Q35. Implement function composition (`compose` and `pipe`).

```js
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

const add2 = x => x + 2;
const double = x => x * 2;
const square = x => x * x;

console.log(compose(square, double, add2)(3)); // ((3+2)*2)^2 = 100
console.log(pipe(add2, double, square)(3));     // ((3+2)*2)^2 = 100
```

**Explanation:** `compose` applies functions **right-to-left** (mathematical composition), while `pipe` applies them **left-to-right** (data-flow order). Both use `reduce`/`reduceRight` to thread a value through a sequence of transformations. They're fundamental building blocks of functional programming.

---

### Q36. Implement a `retry` mechanism with exponential backoff.

```js
async function retry(fn, retries = 3, delay = 500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(res => setTimeout(res, delay * 2 ** (attempt - 1)));
    }
  }
}

// Usage
retry(() => fetch("/api/data").then(r => r.json()), 3, 1000)
  .then(console.log)
  .catch(err => console.error("Failed after retries:", err));
```

**Explanation:** This retries a failing async operation up to `retries` times. After each failure (except the last), it waits with **exponential backoff** — the delay doubles each attempt (`delay * 2^(attempt-1)`), reducing load on a struggling service. The final failure re-throws the error.

---

### Q37. Implement a `LRU` (Least Recently Used) cache.

```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // preserves insertion order
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);   // re-insert to mark as most recently used
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value); // evict oldest
    }
    this.cache.set(key, value);
  }
}

const lru = new LRUCache(2);
lru.put(1, "a"); lru.put(2, "b");
lru.get(1);        // "a" (1 is now most recent)
lru.put(3, "c");   // evicts key 2
console.log(lru.get(2)); // -1
```

**Explanation:** An **LRU cache** evicts the least recently used entry when full. A JavaScript `Map` preserves insertion order, so the first key is the oldest. On `get`/`put`, we delete and re-insert the key to move it to the "most recent" end. Eviction removes `keys().next().value` (the oldest). All operations are **O(1)**.

---

### Q38. Flatten a deeply nested object into dot notation.

```js
function flattenObject(obj, prefix = "", result = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

console.log(flattenObject({ a: { b: { c: 1 }, d: 2 }, e: 3 }));
// { "a.b.c": 1, "a.d": 2, "e": 3 }
```

**Explanation:** We recursively walk the object, building a **dot-notation path** as the prefix. When we hit a non-object (leaf) value, we record it under its full path. This pattern is common for config flattening, form serialization, and diffing nested data.

---

### Q39. What is the Temporal Dead Zone (TDZ)? Demonstrate it.

```js
{
  // TDZ for `x` starts here
  console.log(typeof x); // ReferenceError (not "undefined"!)
  let x = 5;             // TDZ ends here
}

// Compare with var:
console.log(typeof y); // "undefined" (no TDZ)
var y = 5;
```

**Explanation:** The **Temporal Dead Zone** is the period between entering a scope and the actual `let`/`const` declaration. During the TDZ the variable exists but cannot be accessed — even `typeof` throws a `ReferenceError`. This contrasts with `var`, which is initialized to `undefined` immediately. The TDZ helps catch use-before-declaration bugs.

---

### Q40. Implement `Array.prototype.flat` with a depth parameter.

```js
function flatten(arr, depth = 1) {
  return depth > 0
    ? arr.reduce(
        (acc, val) =>
          acc.concat(Array.isArray(val) ? flatten(val, depth - 1) : val),
        []
      )
    : arr.slice();
}

console.log(flatten([1, [2, [3, [4]]]], 1)); // [1, 2, [3, [4]]]
console.log(flatten([1, [2, [3, [4]]]], 2)); // [1, 2, 3, [4]]
console.log(flatten([1, [2, [3, [4]]]], Infinity)); // [1, 2, 3, 4]
```

**Explanation:** Unlike the simple flatten, this respects a **depth** limit. Each recursive call decrements `depth`; when `depth` reaches `0`, we stop flattening and keep nested arrays intact. Passing `Infinity` flattens completely.

---

### Q41. Explain and fix this `this` binding problem.

```js
class Timer {
  constructor() {
    this.seconds = 0;
  }
  start() {
    setInterval(function () {
      this.seconds++; // `this` is NOT the Timer instance!
      console.log(this.seconds);
    }, 1000);
  }
}

// Fix 1: arrow function (lexical this)
start() {
  setInterval(() => {
    this.seconds++;
    console.log(this.seconds);
  }, 1000);
}

// Fix 2: bind
start() {
  setInterval(function () {
    this.seconds++;
  }.bind(this), 1000);
}
```

**Explanation:** A regular `function` passed to `setInterval` is called with `this` set to the global object (or `undefined` in strict mode), not the `Timer` instance — so `this.seconds` is `NaN`/error. An **arrow function** inherits `this` lexically from `start`, fixing the bug. Alternatively, `.bind(this)` permanently binds the instance.

---

### Q42. Implement a function that limits concurrency of async tasks.

```js
async function asyncPool(limit, tasks) {
  const results = [];
  const executing = new Set();

  for (const task of tasks) {
    const p = Promise.resolve().then(() => task());
    results.push(p);
    executing.add(p);
    p.finally(() => executing.delete(p));

    if (executing.size >= limit) {
      await Promise.race(executing); // wait for a slot to free up
    }
  }
  return Promise.all(results);
}

// Usage: run 5 tasks, max 2 at a time
const tasks = [1, 2, 3, 4, 5].map(n => () =>
  new Promise(res => setTimeout(() => res(n), 1000))
);
asyncPool(2, tasks).then(console.log); // [1, 2, 3, 4, 5]
```

**Explanation:** This runs many async tasks but caps how many execute **simultaneously**. We track in-flight promises in a `Set`; once we hit the `limit`, we `await Promise.race` to pause until at least one finishes, freeing a slot. This prevents overwhelming APIs or resources (rate limiting).

---

### Q43. What is the output? (Generators)

```js
function* gen() {
  const x = yield 1;
  const y = yield x + 1;
  return y * 2;
}

const it = gen();
console.log(it.next());    // { value: 1, done: false }
console.log(it.next(10));  // { value: 11, done: false }
console.log(it.next(5));   // { value: 10, done: true }
```

**Explanation:** A **generator** pauses at each `yield` and resumes on `next()`. The value passed to `next(arg)` becomes the **result of the paused `yield` expression**. First `next()` runs to `yield 1`. `next(10)` makes `x = 10`, then yields `x + 1 = 11`. `next(5)` makes `y = 5`, returns `y * 2 = 10` with `done: true`.

---

### Q44. Implement a `once` function (runs only once).

```js
function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

const init = once(() => { console.log("Initialized"); return 42; });
console.log(init()); // "Initialized" then 42
console.log(init()); // 42 (no log — runs once)
```

**Explanation:** `once` wraps a function so its logic executes **only on the first call**; subsequent calls return the cached result without re-running. This is useful for one-time setup/initialization, singletons, and ensuring side effects happen exactly once.

---

### Q45. Explain `Object.freeze` vs `Object.seal` vs `const`.

```js
const obj = Object.freeze({ a: 1, nested: { b: 2 } });
obj.a = 99;           // ignored (silently in non-strict)
obj.nested.b = 99;    // WORKS — freeze is shallow!
console.log(obj);     // { a: 1, nested: { b: 99 } }

const sealed = Object.seal({ a: 1 });
sealed.a = 2;         // allowed (can modify existing)
sealed.b = 3;         // ignored (cannot add new)
```

**Explanation:** `const` only prevents **reassignment of the binding**, not mutation of the object. `Object.seal` prevents **adding/removing** properties but allows modifying existing ones. `Object.freeze` prevents adding, removing, **and** modifying — but it's **shallow**, so nested objects remain mutable (use a recursive "deep freeze" for full immutability).

---

### Q46. Implement deep equality comparison.

```js
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a == null || b == null)
    return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => deepEqual(a[key], b[key]));
}

console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true
console.log(deepEqual([1, [2, 3]], [1, [2, 3]])); // true
console.log(deepEqual({ a: 1 }, { a: 2 }));        // false
```

**Explanation:** Since objects compare by reference (`===`), we need structural comparison. We short-circuit on strict equality, reject mismatched types/null, ensure both have the **same number of keys**, then recursively compare each value. Arrays work too since they're objects with numeric keys.

---

### Q47. What is the output? (Hoisting + functions)

```js
var x = 1;
function foo() {
  console.log(x); // undefined (not 1!)
  var x = 2;
  console.log(x); // 2
}
foo();
```

**Explanation:** Inside `foo`, the local `var x` is **hoisted** to the top of the function, shadowing the outer `x`. At the first `console.log`, the local `x` exists but is still `undefined` (only the declaration is hoisted, not the assignment `= 2`). After assignment, it's `2`. The outer `x = 1` is never seen inside `foo`.

---

### Q48. Implement a polyfill for `Array.prototype.reduce` with edge cases.

```js
Array.prototype.myReduce = function (callback, initialValue) {
  if (this == null) throw new TypeError("Array.prototype.reduce called on null");
  if (typeof callback !== "function") throw new TypeError(callback + " is not a function");

  const arr = Object(this);
  const len = arr.length >>> 0;
  let acc, startIndex = 0;

  if (arguments.length >= 2) {
    acc = initialValue;
  } else {
    while (startIndex < len && !(startIndex in arr)) startIndex++;
    if (startIndex >= len) throw new TypeError("Reduce of empty array with no initial value");
    acc = arr[startIndex++];
  }

  for (let i = startIndex; i < len; i++) {
    if (i in arr) acc = callback(acc, arr[i], i, arr);
  }
  return acc;
};
```

**Explanation:** A spec-compliant `reduce` must handle: **no initial value** (use first element, error if empty), **sparse arrays** (skip holes via `i in arr`), and **type validation**. `len >>> 0` coerces length to a non-negative integer. This level of detail demonstrates understanding of the actual ECMAScript spec.

---

### Q49. What is the output? (Closures in loops with objects)

```js
const funcs = [];
for (let i = 0; i < 3; i++) {
  funcs.push({
    id: i,
    getId: function () { return this.id; },
    getClosureId: () => i,
  });
}

console.log(funcs[1].getId());        // 1
console.log(funcs[1].getClosureId()); // 1
console.log(funcs.map(f => f.getId()));        // [0, 1, 2]
console.log(funcs.map(f => f.getClosureId())); // [0, 1, 2]
```

**Explanation:** With `let`, each iteration gets its **own `i`**, so closures capture distinct values `0, 1, 2`. `getId` uses `this.id` (the object's own property), and `getClosureId` (arrow) closes over the per-iteration `i`. Both return the correct id. If `var` were used, all `getClosureId` would return `3`.

---

### Q50. Implement a deep `get` function for safely accessing nested properties.

```js
function get(obj, path, defaultValue = undefined) {
  const keys = Array.isArray(path) ? path : path.replace(/\[(\d+)\]/g, ".$1").split(".");
  let result = obj;
  for (const key of keys) {
    if (result == null) return defaultValue;
    result = result[key];
  }
  return result === undefined ? defaultValue : result;
}

const data = { user: { profile: { name: "Alice", tags: ["a", "b"] } } };
console.log(get(data, "user.profile.name"));     // "Alice"
console.log(get(data, "user.profile.tags[1]")); // "b"
console.log(get(data, "user.settings.theme", "dark")); // "dark" (fallback)
```

**Explanation:** This safely traverses a nested path (like Lodash's `_.get`) without throwing on missing intermediate objects. We parse the path string (converting `[0]` to `.0`), then walk key-by-key, returning the `defaultValue` if we hit `null`/`undefined`. This avoids verbose `obj && obj.a && obj.a.b` chains (optional chaining `?.` solves the same problem natively).

---

## Quick Reference: Common Interview Topics

- **Scope & Closures** — lexical scoping, IIFE, module pattern
- **`this` binding** — call/apply/bind, arrow functions
- **Event Loop** — microtasks vs macrotasks, call stack
- **Promises & async/await** — error handling, `Promise.all/race/allSettled`
- **Prototypes** — inheritance, `__proto__`, prototype chain
- **ES6+ features** — destructuring, spread/rest, generators, `Map`/`Set`
- **Higher-order functions** — `map`/`filter`/`reduce`, currying, composition
- **Performance** — debounce, throttle, memoization
- **Type coercion** — truthy/falsy, `==` vs `===`

---

*Happy coding and good luck with your interviews!*
