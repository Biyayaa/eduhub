import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import React Router components
import Signup from './Signup';
import Login from './Login'; // Assuming you have a Login component
import StudentDashboard from './StudentDashboard'; // Assuming you have a Dashboard component
import LecturerDashboard from './LecturerDashboard';




function App() {
  return (
    <div className="app-wrapper"> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/studentdashboard" element={<StudentDashboard/>} />
          <Route path="/lecturerdashboard" element={<LecturerDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

