import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/health")
      .then((response) => response.json())
      .then((data) => {
        setStatus(data.status);
      })
      .catch((error) => {
        console.error("Error:", error);
        setStatus("Backend connection failed");
      });
  }, []);

  return (
    <div>
      <h1>CareerFlow</h1>
      <p>Backend status: {status}</p>
    </div>
  );
}

export default App
