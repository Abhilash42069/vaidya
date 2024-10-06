import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login'; // Adjust the import based on your file structure
import ChatApp from './ChatApp'; // Import your chat app component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<ChatApp />} />
      </Routes>
    </Router>
  );
}

export default App;
