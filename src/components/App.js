import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import React Router components
import Signup from './Signup';
import Login from './Login'; // Assuming you have a Login component
import Dashboard from './Dashboard'; // Assuming you have a Dashboard component




function App() {
  return (
    <div className="app-wrapper"> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

