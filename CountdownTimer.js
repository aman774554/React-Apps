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

