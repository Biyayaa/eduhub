import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Assuming your initialization is in firebase.js
import { createUserWithEmailAndPassword } from 'firebase/auth';


function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setErrorMessage('');

    if (password !== confirmPassword) {
      return setErrorMessage('Passwords do not match.'); 
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/login');// Successful signup - redirect to login
     } catch (error) {
      setErrorMessage('Signup failed: ' + error.message); 
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>} 
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email"
            id="email" // Add an ID for better label association
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input 
            type="password" 
            id="confirmPassword" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Log In</Link></p>
    </div>
  );
}

export default Signup;
