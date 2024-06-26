import React, { useState } from "react";
import "./styles.css";
const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    hobbies: [""],
  });

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "hobbies") {
      const hobbies = [...formData.hobbies];
      hobbies[index] = value;
      setFormData({
        ...formData,
        hobbies,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddHobbie = (e) => {
    e.preventDefault();
    setFormData({ ...formData, hobbies: [...formData.hobbies, ""] });
  };

  return (
    <>
      <h1>Dynamic Form</h1>
      <form>
        <div className="box">
          <label htmlfor="name">Name: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="box">
          <label htmlfor="age">Age: </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>

        {formData.hobbies.map((data, index) => (
          <div className="box">
            <label htmlfor={`hobbie${index}`}>Hobbie {index + 1}: </label>
            <input
              type="text"
              name={`hobbies`}
              value={data}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
        ))}
        <button onClick={handleAddHobbie}>Add Hobbie</button>
        <button>Submit</button>
      </form>

      {JSON.stringify(formData, null, 2)}
    </>
  );
};

export default App;
