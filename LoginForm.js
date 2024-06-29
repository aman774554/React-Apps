import React, { useState } from "react";
function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    alert(JSON.stringify(formData, null, 2));
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username"> Username: </label>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            value={formData.username}
          />
        </div>
        <br />
        <div>
          <label htmlFor="password">Password: </label>
          <input
            type="text"
            name="password"
            onChange={handleChange}
            value={formData.password}
          />
        </div>
        <br />
        <button type="submit">LOGIN</button>
      </form>

      <br />

      {(formData.username || formData.password) &&
        JSON.stringify(formData, null, 2)}
    </>
  );
}

export default App;
