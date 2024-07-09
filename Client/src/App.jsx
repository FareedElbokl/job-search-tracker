import React, { useState, useEffect } from "react";

const App = () => {
  const [message, setMessage] = useState("Yo");

  async function testApi() {
    try {
      const response = await fetch("http://localhost:3000/api");
      const text = await response.text(); // Parse the response as text
      setMessage(text); // Update the state with the fetched message
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    testApi();
  });
  return <div>{message}</div>;
};

export default App;
