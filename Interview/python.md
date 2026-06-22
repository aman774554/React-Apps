# Python Coding Interview Questions

A curated list of frequently asked Python coding questions with answers and detailed explanations.

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Data Structures](#data-structures)
3. [Functions & Scope](#functions--scope)
4. [OOP](#oop)
5. [Iterators, Generators & Decorators](#iterators-generators--decorators)
6. [Comprehensions & Functional](#comprehensions--functional)
7. [Coding Challenges](#coding-challenges)
8. [Tricky Output Questions](#tricky-output-questions)
9. [Advanced / Hard Questions](#advanced--hard-questions)

---

## Core Concepts

### Q1. What is the difference between a list, tuple, and set?

```python
my_list = [1, 2, 2, 3]    # mutable, ordered, allows duplicates
my_tuple = (1, 2, 2, 3)   # immutable, ordered, allows duplicates
my_set = {1, 2, 2, 3}     # mutable, unordered, unique → {1, 2, 3}

my_list[0] = 99           # OK
# my_tuple[0] = 99        # TypeError: 'tuple' object does not support item assignment
```

**Explanation:** A **list** is mutable and ordered, ideal for collections that change. A **tuple** is immutable and ordered, useful for fixed data and as dictionary keys (since it's hashable). A **set** stores unordered, unique elements with O(1) membership tests, perfect for deduplication and fast lookups.

---

### Q2. What is the difference between `is` and `==`?

```python
a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)   # True  (same values)
print(a is b)   # False (different objects in memory)

x = 256
y = 256
print(x is y)   # True  (small int caching)

x = 257
y = 257
print(x is y)   # False (outside cache range, in CPython)
```

**Explanation:** `==` compares **values** (equality), while `is` compares **identity** (whether two references point to the same object in memory). CPython caches small integers (-5 to 256) and short strings, so `is` may surprisingly return `True` for them — never rely on `is` for value comparison; use it only for `None` checks.

---

### Q3. How does Python manage mutable vs immutable types?

```python
# Immutable: int, float, str, tuple, frozenset, bool
x = 10
y = x
x += 5
print(x, y)  # 15 10 — y unaffected

# Mutable: list, dict, set
a = [1, 2]
b = a
a.append(3)
print(a, b)  # [1, 2, 3] [1, 2, 3] — b reflects change!
```

**Explanation:** **Immutable** objects cannot be changed in place; operations create new objects. **Mutable** objects can be modified in place, and assignment only copies the **reference**, so two variables can point to the same object. This is the source of many "why did my list change?" bugs.

---

### Q4. What is the difference between `==` for strings and the `in` operator?

```python
text = "hello world"
print("world" in text)        # True (substring check)
print("xyz" in text)          # False

nums = [1, 2, 3]
print(2 in nums)              # True (membership)
print(2 in {1: "a", 2: "b"})  # True (checks keys)
```

**Explanation:** The `in` operator checks **membership**: for strings it tests substrings, for lists/tuples/sets it tests element presence, and for dictionaries it tests **keys** (not values). It's a clean, readable alternative to manual loops.

---

## Data Structures

### Q5. How do you reverse a list and a string?

```python
# List
lst = [1, 2, 3]
print(lst[::-1])        # [3, 2, 1] (slice, new list)
lst.reverse()           # in-place
print(list(reversed(lst)))  # iterator → list

# String
s = "hello"
print(s[::-1])          # "olleh"
print("".join(reversed(s)))  # "olleh"
```

**Explanation:** Slicing with `[::-1]` is the most Pythonic way to reverse and returns a **new** sequence. `list.reverse()` mutates in place, while `reversed()` returns a lazy iterator. Strings are immutable, so they can only be reversed into a new string.

---

### Q6. How do you merge two dictionaries?

```python
a = {"x": 1, "y": 2}
b = {"y": 3, "z": 4}

# Python 3.9+
merged = a | b
print(merged)  # {'x': 1, 'y': 3, 'z': 4}

# Python 3.5+
merged = {**a, **b}

# In-place update
a.update(b)
```

**Explanation:** The `|` operator (3.9+) and `{**a, **b}` unpacking both create a **new** merged dict; when keys collide, the **right-hand** value wins. `update()` mutates the first dict in place. Note `b`'s `y=3` overrides `a`'s `y=2`.

---

### Q7. What is a `defaultdict` and `Counter`?

```python
from collections import defaultdict, Counter

# defaultdict — no KeyError for missing keys
dd = defaultdict(list)
dd["fruits"].append("apple")  # auto-creates empty list
print(dd)  # {'fruits': ['apple']}

# Counter — count hashable items
c = Counter("mississippi")
print(c)              # {'i': 4, 's': 4, 'p': 2, 'm': 1}
print(c.most_common(2))  # [('i', 4), ('s', 4)]
```

**Explanation:** `defaultdict` provides a default value for missing keys via a factory function, eliminating boilerplate `if key not in dict` checks. `Counter` is a specialized dict for counting hashable objects, with handy methods like `most_common()`. Both live in the `collections` module.

---

## Functions & Scope

### Q8. What are `*args` and `**kwargs`?

```python
def func(*args, **kwargs):
    print("args:", args)      # tuple of positional args
    print("kwargs:", kwargs)  # dict of keyword args

func(1, 2, 3, name="Alice", age=30)
# args: (1, 2, 3)
# kwargs: {'name': 'Alice', 'age': 30}
```

**Explanation:** `*args` collects extra **positional** arguments into a tuple, and `**kwargs` collects extra **keyword** arguments into a dict. They enable functions to accept a variable number of arguments. The names are convention; the `*` and `**` are what matter.

---

### Q9. Explain the mutable default argument pitfall.

```python
# Bug
def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item(1))  # [1]
print(add_item(2))  # [1, 2] — same list reused!

# Fix
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

**Explanation:** Default arguments are evaluated **once** at function definition, not each call. A mutable default (like `[]`) is shared across all calls, accumulating state unexpectedly. The fix is to use `None` as the sentinel default and create a fresh object inside the function.

---

### Q10. What is the difference between local, global, and nonlocal scope?

```python
x = "global"

def outer():
    y = "enclosing"
    def inner():
        global x
        nonlocal y
        x = "modified global"
        y = "modified enclosing"
    inner()
    print(y)  # "modified enclosing"

outer()
print(x)  # "modified global"
```

**Explanation:** Python resolves names using the **LEGB** rule: Local → Enclosing → Global → Built-in. The `global` keyword lets you reassign a module-level variable, and `nonlocal` lets you reassign a variable in the nearest enclosing (non-global) scope. Without them, assignment creates a new local variable.

---

## OOP

### Q11. What is the difference between `@staticmethod`, `@classmethod`, and instance methods?

```python
class MyClass:
    count = 0

    def instance_method(self):
        return f"instance, {self}"

    @classmethod
    def class_method(cls):
        return f"class, {cls.count}"

    @staticmethod
    def static_method():
        return "static, no access to self/cls"
```

**Explanation:** An **instance method** takes `self` and can access instance and class state. A **classmethod** takes `cls` and operates on the class itself (great for alternative constructors/factories). A **staticmethod** takes neither — it's just a function grouped within the class namespace, with no access to instance or class data.

---

### Q12. Explain `__init__`, `__str__`, and `__repr__`.

```python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __str__(self):
        return f"({self.x}, {self.y})"        # user-friendly

    def __repr__(self):
        return f"Point(x={self.x}, y={self.y})"  # unambiguous, for devs

p = Point(1, 2)
print(p)        # (1, 2) — uses __str__
print(repr(p))  # Point(x=1, y=2)
print([p])      # [Point(x=1, y=2)] — containers use __repr__
```

**Explanation:** `__init__` initializes a new instance. `__str__` returns a readable string for end users (`print`/`str`). `__repr__` returns an unambiguous representation for developers/debugging (`repr`, REPL, inside containers). If `__str__` is missing, Python falls back to `__repr__`.

---

### Q13. How does multiple inheritance and MRO work?

```python
class A:
    def greet(self): return "A"
class B(A):
    def greet(self): return "B"
class C(A):
    def greet(self): return "C"
class D(B, C):
    pass

d = D()
print(d.greet())        # "B"
print(D.__mro__)        # D → B → C → A → object
```

**Explanation:** Python uses the **C3 linearization** algorithm to compute the **Method Resolution Order (MRO)** — the order in which base classes are searched. For `D(B, C)`, it checks `D`, then `B`, then `C`, then `A`. This avoids the "diamond problem" ambiguity. View it with `__mro__` or `mro()`.

---

## Iterators, Generators & Decorators

### Q14. What is the difference between an iterator and a generator?

```python
# Generator function (lazy)
def count_up(n):
    i = 0
    while i < n:
        yield i
        i += 1

gen = count_up(3)
print(next(gen))  # 0
print(next(gen))  # 1
print(list(gen))  # [2]

# Generator expression
squares = (x**2 for x in range(5))  # lazy, memory-efficient
```

**Explanation:** An **iterator** is any object implementing `__iter__` and `__next__`. A **generator** is a simpler way to create iterators using `yield`, which pauses execution and resumes on the next `next()` call. Generators are **lazy** and memory-efficient — they produce values on demand instead of storing everything at once.

---

### Q15. Write a decorator that measures execution time.

```python
import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "done"

slow_function()  # slow_function took 1.0xxx s
```

**Explanation:** A **decorator** is a function that wraps another function to extend its behavior without modifying it. `@timer` replaces `slow_function` with `wrapper`, which times the call. `@wraps(func)` preserves the original function's metadata (`__name__`, docstring). `*args, **kwargs` make the decorator work with any signature.

---

### Q16. Write a decorator with arguments.

```python
from functools import wraps

def repeat(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(times=3)
def greet(name):
    print(f"Hello {name}")

greet("Bob")  # prints 3 times
```

**Explanation:** A **parameterized decorator** requires an extra layer: the outermost function takes the decorator's arguments and returns the actual decorator, which then wraps the function. So `@repeat(times=3)` calls `repeat(3)`, which returns `decorator`, which wraps `greet`.

---

## Comprehensions & Functional

### Q17. Show list, dict, and set comprehensions.

```python
# List comprehension
squares = [x**2 for x in range(5)]          # [0, 1, 4, 9, 16]

# With condition
evens = [x for x in range(10) if x % 2 == 0]  # [0, 2, 4, 6, 8]

# Dict comprehension
square_map = {x: x**2 for x in range(4)}     # {0: 0, 1: 1, 2: 4, 3: 9}

# Set comprehension
unique = {x % 3 for x in range(10)}          # {0, 1, 2}

# Nested
matrix = [[i*j for j in range(3)] for i in range(3)]
```

**Explanation:** Comprehensions provide a concise, readable way to build collections from iterables. They're generally faster than equivalent `for` loops with `.append()`. The `if` clause filters elements, and they can be nested — though deeply nested comprehensions hurt readability.

---

### Q18. What do `map`, `filter`, and `reduce` do?

```python
from functools import reduce

nums = [1, 2, 3, 4, 5]

print(list(map(lambda x: x*2, nums)))       # [2, 4, 6, 8, 10]
print(list(filter(lambda x: x % 2 == 0, nums)))  # [2, 4]
print(reduce(lambda a, b: a + b, nums))     # 15

# Pythonic equivalents
print([x*2 for x in nums])
print([x for x in nums if x % 2 == 0])
print(sum(nums))
```

**Explanation:** `map` applies a function to every item, `filter` keeps items passing a predicate, and `reduce` (from `functools`) accumulates items into a single value. `map`/`filter` return lazy iterators. In Python, comprehensions and built-ins like `sum()` are usually preferred for readability.

---

## Coding Challenges

### Q19. Check if a string is a palindrome.

```python
def is_palindrome(s):
    cleaned = "".join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]

print(is_palindrome("A man, a plan, a canal: Panama"))  # True
print(is_palindrome("hello"))  # False
```

**Explanation:** We normalize the string (lowercase, keep only alphanumeric characters), then compare it with its reverse using slicing `[::-1]`. If they match, it's a palindrome. This handles spaces, punctuation, and case.

---

### Q20. Find the most frequent element in a list.

```python
from collections import Counter

def most_frequent(lst):
    return Counter(lst).most_common(1)[0][0]

print(most_frequent([1, 3, 3, 3, 2, 2, 1]))  # 3
```

**Explanation:** `Counter` builds a frequency map in O(n), and `most_common(1)` returns the single highest-count `(element, count)` pair. We index `[0][0]` to extract the element itself. This is far cleaner than manually looping and tracking a max.

---

### Q21. Find two numbers that sum to a target (Two Sum).

```python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return None

print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
```

**Explanation:** Using a hash map (dict) to store each number's index, we check in O(1) whether the **complement** (`target - num`) was already seen. This gives an overall **O(n)** solution, far better than the O(n²) brute-force nested loop.

---

### Q22. Remove duplicates while preserving order.

```python
def dedupe(lst):
    return list(dict.fromkeys(lst))

print(dedupe([1, 2, 2, 3, 1, 4]))  # [1, 2, 3, 4]
```

**Explanation:** Since Python 3.7, dicts preserve insertion order, and `dict.fromkeys()` builds a dict with unique keys (duplicates collapse). Converting back to a list gives a deduplicated, order-preserving result. A plain `set()` would lose order.

---

### Q23. Flatten a nested list.

```python
def flatten(nested):
    result = []
    for item in nested:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

print(flatten([1, [2, [3, [4]], 5]]))  # [1, 2, 3, 4, 5]
```

**Explanation:** We recursively walk the structure: if an item is itself a list, we flatten it and `extend` the result; otherwise we `append` the value. This handles arbitrary nesting depth.

---

### Q24. Count word frequency in a sentence.

```python
from collections import Counter

def word_count(text):
    words = text.lower().split()
    return dict(Counter(words))

print(word_count("the cat the dog the bird"))
# {'the': 3, 'cat': 1, 'dog': 1, 'bird': 1}
```

**Explanation:** We lowercase and split the text into words, then `Counter` tallies frequencies in one pass. For production text processing you'd also strip punctuation (e.g., with `re.findall(r"\w+", text)`).

---

## Tricky Output Questions

### Q25. What is the output?

```python
print(0.1 + 0.2 == 0.3)  # False
print(0.1 + 0.2)          # 0.30000000000000004
```

**Explanation:** Floating-point numbers use binary (IEEE 754) representation, and `0.1`/`0.2` can't be stored exactly, causing rounding error. To compare floats, use `math.isclose(0.1 + 0.2, 0.3)`.

---

### Q26. What is the output?

```python
a = [1, 2, 3]
b = a
c = a[:]
a.append(4)
print(b)  # [1, 2, 3, 4] — b is a reference
print(c)  # [1, 2, 3] — c is a shallow copy
```

**Explanation:** `b = a` copies the **reference**, so both point to the same list. `c = a[:]` (slice) creates a **shallow copy**, an independent list. Mutating `a` affects `b` but not `c`.

---

### Q27. What is the output?

```python
print(bool("False"))   # True
print(bool(""))        # False
print(bool(0))         # False
print(bool([]))        # False
print(bool([0]))       # True
print(bool(" "))       # True
```

**Explanation:** Any **non-empty** string is truthy — even `"False"` and `" "` (a space). Falsy values include `0`, `0.0`, `""`, `None`, `[]`, `{}`, `()`, and `set()`. A list containing a falsy element `[0]` is still truthy because it's non-empty.

---

### Q28. What is the output?

```python
def func(x, lst=[]):
    lst.append(x)
    return lst

print(func(1))  # [1]
print(func(2))  # [1, 2]
print(func(3, []))  # [3]
print(func(4))  # [1, 2, 4]
```

**Explanation:** The default list is created **once** and shared across calls (the mutable default argument trap). Calls without an explicit list accumulate into the same list (`[1]`, `[1, 2]`, `[1, 2, 4]`), while passing a fresh `[]` uses a new list (`[3]`).

---

### Q29. What is the output?

```python
print([1, 2, 3] * 2)       # [1, 2, 3, 1, 2, 3]
print("ab" * 3)            # "ababab"

matrix = [[0] * 3] * 3
matrix[0][0] = 1
print(matrix)  # [[1, 0, 0], [1, 0, 0], [1, 0, 0]]
```

**Explanation:** `*` repeats sequences. But `[[0]*3]*3` creates **three references to the same inner list**, so modifying one row modifies all. To create independent rows, use a comprehension: `[[0]*3 for _ in range(3)]`.

---

### Q30. What is the output?

```python
x = 5
def foo():
    print(x)  # UnboundLocalError!
    x = 10
foo()
```

**Explanation:** Because `x` is **assigned** inside `foo`, Python treats it as a **local** variable for the entire function scope. So the `print(x)` before the assignment raises `UnboundLocalError`. Use `global x` (or restructure) if you intended to read the outer `x`.

---

## Advanced / Hard Questions

### Q31. Implement a context manager (both class-based and `contextlib`).

```python
# Class-based
class FileManager:
    def __init__(self, filename, mode):
        self.filename, self.mode = filename, mode
    def __enter__(self):
        self.file = open(self.filename, self.mode)
        return self.file
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.file.close()
        return False  # propagate exceptions

# Decorator-based
from contextlib import contextmanager

@contextmanager
def open_file(name, mode):
    f = open(name, mode)
    try:
        yield f
    finally:
        f.close()

with open_file("test.txt", "w") as f:
    f.write("hello")
```

**Explanation:** A **context manager** guarantees setup/teardown via the `with` statement. The class form implements `__enter__` (returns the resource) and `__exit__` (cleanup, runs even on exceptions). The `@contextmanager` decorator turns a generator into one: code before `yield` is setup, the `finally` block is teardown. Returning `False` from `__exit__` re-raises exceptions.

---

### Q32. What is the GIL and how does it affect concurrency?

```python
import threading

# CPU-bound: threads do NOT speed up (GIL serializes bytecode)
# Use multiprocessing instead
from multiprocessing import Pool

def cpu_task(n):
    return sum(i*i for i in range(n))

with Pool(4) as p:
    results = p.map(cpu_task, [10**6] * 4)  # true parallelism
```

**Explanation:** The **Global Interpreter Lock (GIL)** allows only one thread to execute Python bytecode at a time, so threads don't give true parallelism for **CPU-bound** work. For CPU-bound tasks use `multiprocessing` (separate processes, separate GILs). Threads are still useful for **I/O-bound** work, where the GIL is released during blocking calls.

---

### Q33. Explain `__slots__` and its benefits.

```python
class Point:
    __slots__ = ("x", "y")  # no __dict__
    def __init__(self, x, y):
        self.x, self.y = x, y

p = Point(1, 2)
# p.z = 3  # AttributeError: 'Point' object has no attribute 'z'
```

**Explanation:** By default, instances store attributes in a `__dict__`, which uses extra memory. `__slots__` declares a fixed set of attributes, eliminating the per-instance dict — saving **memory** (significant for many instances) and slightly speeding attribute access. The trade-off: you can't add new attributes dynamically.

---

### Q34. Implement an LRU cache (and use the built-in).

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def fib(n):
    if n < 2:
        return n
    return fib(n-1) + fib(n-2)

print(fib(50))  # instant due to memoization
print(fib.cache_info())  # CacheInfo(hits=..., misses=...)
```

**Explanation:** `@lru_cache` memoizes function results keyed by arguments, evicting the **least recently used** entries when `maxsize` is exceeded. For recursive functions like Fibonacci it turns exponential O(2ⁿ) into linear O(n). Arguments must be hashable. `cache_info()` exposes hit/miss stats.

---

### Q35. What is the difference between deep copy and shallow copy?

```python
import copy

original = [[1, 2], [3, 4]]

shallow = copy.copy(original)
shallow[0][0] = 99
print(original)  # [[99, 2], [3, 4]] — inner list shared!

original = [[1, 2], [3, 4]]
deep = copy.deepcopy(original)
deep[0][0] = 99
print(original)  # [[1, 2], [3, 4]] — fully independent
```

**Explanation:** A **shallow copy** (`copy.copy`) duplicates the outer object but shares references to nested objects, so mutating a nested element affects both. A **deep copy** (`copy.deepcopy`) recursively duplicates everything, fully isolating the copy. `deepcopy` also correctly handles circular references.

---

### Q36. Explain generators for memory efficiency with large data.

```python
# Reading a huge file line-by-line without loading it all
def read_large_file(path):
    with open(path) as f:
        for line in f:
            yield line.strip()

# Generator pipeline
def process(path):
    lines = read_large_file(path)
    numbers = (int(l) for l in lines if l.isdigit())
    return sum(numbers)  # processes lazily, constant memory
```

**Explanation:** Generators yield items **one at a time**, keeping memory usage constant regardless of data size — essential for large files or infinite streams. Chaining generator expressions builds a **lazy pipeline** where each element flows through all stages without intermediate lists, unlike list comprehensions which materialize everything.

---

### Q37. Implement a custom iterator class.

```python
class Fibonacci:
    def __init__(self, limit):
        self.limit = limit
        self.a, self.b, self.count = 0, 1, 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.count >= self.limit:
            raise StopIteration
        self.count += 1
        value = self.a
        self.a, self.b = self.b, self.a + self.b
        return value

print(list(Fibonacci(7)))  # [0, 1, 1, 2, 3, 5, 8]
```

**Explanation:** The **iterator protocol** requires `__iter__` (returns the iterator object, usually `self`) and `__next__` (returns the next value or raises `StopIteration` when exhausted). This lets the class work seamlessly with `for` loops, `list()`, and comprehensions. Generators are usually simpler, but this shows the underlying mechanism.

---

### Q38. What is monkey patching? Show an example.

```python
class Calculator:
    def add(self, a, b):
        return a + b

def multiply(self, a, b):
    return a * b

# Add/override a method at runtime
Calculator.multiply = multiply

calc = Calculator()
print(calc.multiply(3, 4))  # 12
```

**Explanation:** **Monkey patching** is dynamically modifying classes or modules at runtime. Here we attach a new `multiply` method to `Calculator` after definition. It's powerful for testing (mocking) and hotfixing third-party code, but overuse makes code unpredictable and hard to debug — use sparingly.

---

### Q39. Explain metaclasses with a simple example.

```python
class SingletonMeta(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Database(metaclass=SingletonMeta):
    pass

a = Database()
b = Database()
print(a is b)  # True — same instance
```

**Explanation:** A **metaclass** is the "class of a class" — it controls how classes are created (default is `type`). By overriding `__call__`, we intercept instance creation to enforce a **singleton** (one shared instance). Metaclasses are advanced; most problems are better solved with class decorators or simpler patterns.

---

### Q40. What is the output? (Closures and late binding)

```python
funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])  # [2, 2, 2]

# Fix: bind i at definition time
funcs = [lambda i=i: i for i in range(3)]
print([f() for f in funcs])  # [0, 1, 2]
```

**Explanation:** Python closures capture variables by **reference**, not value (late binding). All three lambdas reference the same `i`, which is `2` after the loop ends. Binding `i` as a **default argument** (`lambda i=i`) captures its value at definition time, fixing the issue.

---

### Q41. Implement `zip` and `enumerate` from scratch.

```python
def my_zip(*iterables):
    iterators = [iter(it) for it in iterables]
    while True:
        result = []
        for it in iterators:
            try:
                result.append(next(it))
            except StopIteration:
                return
        yield tuple(result)

def my_enumerate(iterable, start=0):
    i = start
    for item in iterable:
        yield i, item
        i += 1

print(list(my_zip([1, 2], ["a", "b"])))  # [(1, 'a'), (2, 'b')]
print(list(my_enumerate(["x", "y"], 1)))  # [(1, 'x'), (2, 'y')]
```

**Explanation:** `zip` pairs elements from multiple iterables, stopping at the **shortest** (when any raises `StopIteration`). `enumerate` pairs each element with an incrementing index. Implementing them as generators demonstrates understanding of the iterator protocol and lazy evaluation.

---

### Q42. Explain `async`/`await` and write an async example.

```python
import asyncio

async def fetch(name, delay):
    print(f"{name} start")
    await asyncio.sleep(delay)  # non-blocking
    print(f"{name} done")
    return name

async def main():
    results = await asyncio.gather(
        fetch("A", 2),
        fetch("B", 1),
        fetch("C", 3),
    )
    print(results)  # ['A', 'B', 'C']

asyncio.run(main())  # all run concurrently (~3s, not 6s)
```

**Explanation:** **asyncio** provides single-threaded concurrency for **I/O-bound** tasks. `async def` defines a coroutine; `await` yields control during I/O waits so other coroutines can run. `asyncio.gather` runs coroutines **concurrently**. Unlike threads, there's no GIL contention since it's cooperative multitasking on one thread.

---

### Q43. What is the output? (Dict ordering and comprehension scope)

```python
d = {i: i**2 for i in range(5)}
print(list(d.keys()))  # [0, 1, 2, 3, 4]

# Comprehension variable doesn't leak (unlike Python 2)
print([x for x in range(3)])
# print(x)  # NameError in Python 3
```

**Explanation:** Since Python 3.7, dicts maintain **insertion order**. Also, comprehension loop variables have their **own scope** in Python 3 — they don't leak into the enclosing scope (a change from Python 2). So `x` is undefined after the comprehension.

---

### Q44. Implement a retry decorator with exponential backoff.

```python
import time
from functools import wraps

def retry(retries=3, delay=1, backoff=2):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            current_delay = delay
            for attempt in range(1, retries + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == retries:
                        raise
                    print(f"Attempt {attempt} failed: {e}. Retrying...")
                    time.sleep(current_delay)
                    current_delay *= backoff
        return wrapper
    return decorator

@retry(retries=3, delay=1, backoff=2)
def unreliable():
    import random
    if random.random() < 0.7:
        raise ValueError("Failed")
    return "Success"
```

**Explanation:** This parameterized decorator retries a failing function up to `retries` times, waiting between attempts with **exponential backoff** (delay multiplied by `backoff` each round). The last attempt re-raises the exception. This pattern is essential for resilient network/API calls.

---

### Q45. What is the difference between `@property` and direct attributes?

```python
class Temperature:
    def __init__(self, celsius=0):
        self._celsius = celsius

    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value):
        self._celsius = (value - 32) * 5/9

t = Temperature(25)
print(t.fahrenheit)  # 77.0 (computed)
t.fahrenheit = 212   # uses setter
print(t._celsius)    # 100.0
```

**Explanation:** `@property` turns a method into a **computed attribute** accessed without parentheses, enabling validation, computed values, and read-only fields while keeping a clean attribute-style API. The paired `@x.setter` controls assignment. This lets you start with plain attributes and add logic later without breaking the interface.

---

### Q46. Find the first non-repeating character.

```python
from collections import Counter

def first_unique(s):
    counts = Counter(s)
    for char in s:
        if counts[char] == 1:
            return char
    return None

print(first_unique("swiss"))  # "w"
print(first_unique("aabb"))   # None
```

**Explanation:** We count all characters in O(n) with `Counter`, then iterate the string **in order** to find the first with count 1. Iterating the original string (not the counter) preserves order. Total time complexity is O(n).

---

### Q47. What is the output? (Integer caching and identity)

```python
a = 256
b = 256
print(a is b)  # True

c = 257
d = 257
print(c is d)  # False (in standard CPython REPL)

e = -5
f = -5
print(e is f)  # True
```

**Explanation:** CPython pre-caches small integers in the range **-5 to 256** as singletons for efficiency, so `is` returns `True` for them. Integers outside this range create new objects, so `is` returns `False`. This is an implementation detail — always use `==` for value comparison.

---

### Q48. Group a list of dicts by a key.

```python
from collections import defaultdict

def group_by(items, key):
    groups = defaultdict(list)
    for item in items:
        groups[item[key]].append(item)
    return dict(groups)

data = [
    {"name": "A", "dept": "eng"},
    {"name": "B", "dept": "sales"},
    {"name": "C", "dept": "eng"},
]
print(group_by(data, "dept"))
# {'eng': [{'name': 'A',...}, {'name': 'C',...}], 'sales': [{'name': 'B',...}]}
```

**Explanation:** Using `defaultdict(list)`, we group items by a chosen key without checking for key existence. Each item is appended to its group's list in a single O(n) pass. This is a common data-wrangling pattern (similar to SQL `GROUP BY` or Pandas `groupby`).

---

### Q49. Implement a simple memoization decorator from scratch.

```python
def memoize(func):
    cache = {}
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper

@memoize
def factorial(n):
    return 1 if n <= 1 else n * factorial(n - 1)

print(factorial(5))  # 120 (cached subcalls)
```

**Explanation:** **Memoization** caches results keyed by arguments to avoid recomputation. The closure captures a `cache` dict; on each call we check whether the arguments were seen. Note `args` (a tuple) must be **hashable** to serve as a dict key. The built-in `functools.lru_cache` does this with eviction.

---

### Q50. What is the output? (Exception handling flow)

```python
def func():
    try:
        return "try"
    finally:
        print("finally runs")

print(func())
# Output:
# finally runs
# try
```

**Explanation:** The `finally` block **always executes**, even when `try` contains a `return`. Python evaluates the return value, runs `finally`, then completes the return. So "finally runs" prints **before** the returned "try" is printed by the outer `print`. If `finally` itself returned a value, it would override the `try` return.

---

## Quick Reference: Common Interview Topics

- **Data structures** — list/tuple/set/dict, `collections` module
- **Mutability** — mutable vs immutable, copy semantics, default arg trap
- **Scope** — LEGB rule, `global`/`nonlocal`, closures & late binding
- **OOP** — dunder methods, MRO, `@property`, `__slots__`, metaclasses
- **Iterators/Generators** — `yield`, lazy evaluation, iterator protocol
- **Decorators** — wrapping, `functools.wraps`, parameterized decorators
- **Concurrency** — GIL, threading vs multiprocessing, `asyncio`
- **Functional** — comprehensions, `map`/`filter`/`reduce`, `lambda`
- **Performance** — `lru_cache`, generators for memory, time complexity

---

*Happy coding and good luck with your interviews!*
