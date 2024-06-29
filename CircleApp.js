import { useState } from "react";
import "./styles.css";

export default function App() {
  const [count, setCount] = useState(0);
  const [selectedCircles, setSelectedCircles] = useState([]);
  const handleCount = () => {
    setCount(count + 1);
  };
  const handleCircle = (index) => {
    if (selectedCircles.includes(index)) {
      setSelectedCircles(selectedCircles.filter((data) => data !== index));
    } else {
      setSelectedCircles([...selectedCircles, index]);
    }
  };
  return (
    <div className="App">
      <h1>Cirlces APP</h1>
      <h2>Hey, Click to add circles!</h2>
      <button onClick={handleCount}>Add Circles</button>
      <br />
      <br />
      {`Total count: ${count}`}
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`circle ${
            selectedCircles.includes(index) ? "selected" : ""
          }`}
          onClick={() => handleCircle(index)}
        ></div>
      ))}
      {selectedCircles}
    </div>
  );
}
