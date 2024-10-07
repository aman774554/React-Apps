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

###############################################################################

import { useState } from "react";
import "./styles.css";

export default function App() {
  const [formData, setFormData] = useState({
    name: "",
    hobbie: [""],
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("ok");
  };

  const handleField = (e) => {
    e.preventDefault();
    setFormData({ ...formData, hobbie: [...formData.hobbie, ""] });
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "hobbie") {
      const myhobbie = [...formData.hobbie];
      myhobbie[index] = value;
      setFormData({ ...formData, hobbie: [...myhobbie] });
      name[index];
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name: </label>
        <input
          type="text"
          placeholder="Enter username"
          name="name"
          onChange={handleChange}
        ></input>
        <br />
        {formData.hobbie.map((data, index) => (
          <>
            <input
              name="hobbie"
              value={data}
              onChange={(e) => handleChange(e, index)}
            ></input>
            <br />
          </>
        ))}

        <button onClick={handleField}>Add Hobbie</button>
        <button type="submit">Submit</button>
      </form>
      {JSON.stringify(formData, 2, null)}
    </div>
  );
}

