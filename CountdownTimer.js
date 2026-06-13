==================================================================
  export default function App() {
  const [count, setCount] = useState(3);
  const [active, setActive] = useState(false);
  useEffect(() => {
    let interval;
    if (count === 0) return;
    if (active && count > 0) {
      interval = setInterval(() => {
        setCount((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [active, count]);
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setActive(!active)}>
        {!active ? 'Start' : 'Pause'}
      </button>
      <button
        onClick={() => {
          setActive(false);
          setCount(4);
        }}
      >
        Reset
      </button>
    </div>
  );
}
====================================================================================================
import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [seconds, setSeconds] = useState(10);
  const [active, setActive] = useState(false);
  useEffect(() => {
    let interval = null;
    if (active && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [active, seconds]);

  return (
    <div className="App">
      <h1>{seconds}</h1>
      <button onClick={() => setActive(!active)}>
        {active ? "Pause" : "Start"}
      </button>
      <button
        onClick={() => {
          setActive(false);
          setSeconds(10);
        }}
      >
        Reset
      </button>
    </div>
  );
}
=====================================
import React from 'react';
import { useState, useEffect } from 'react';
export function App(props) {
  const [second, setSecond] = useState(3);
  // In React Strict Mode development builds, React mounts, unmounts, and mounts again to expose bugs like missing cleanup functions. 
  // Without clearInterval, you end up with multiple intervals running simultaneously
  useEffect(() => {
    if (second === 0) return;
      var interval = setInterval(() => {
        setSecond(prev => prev - 1);
      }, 1000);
    return () => clearInterval(interval);
  }, [second]);
  return (
    <div className='App'>
      <h1>Counter</h1>
      <p>{second}</p>
    </div>
  );
}


