import React, { useState, useEffect } from "react";

const App = () => {
  const [message, setMessage] = useState("Yo");

  async function testApi() {
    try {
      print("hello");
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
