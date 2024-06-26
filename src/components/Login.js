import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Assuming your initialization is in firebase.js
import { signInWithEmailAndPassword} from 'firebase/auth';
import { getFirestore, getDoc, doc } from 'firebase/firestore';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setErrorMessage('');

    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        const db = getFirestore();
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
  
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.role === 'student') {
            navigate('/studentdashboard'); 
          } else if (userData.role === 'lecturer') {
            navigate('/lecturerdashboard'); 
          } else {
            setErrorMessage('User role not found');
          }
        } else {
          setErrorMessage('User not found');
        }
      } catch (error) {
        setErrorMessage('Login failed: ' + error.message);
      }
  };

  return (
    <div className="login-container">
      <h2>Log In</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>} 
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email"
            id="email" 
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
        <button type="submit">Log In</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
}

export default Login;
