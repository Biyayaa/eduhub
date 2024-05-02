import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import { getFirestore } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDoc } from 'firebase/firestore'; 

function StudentDashboard() {
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => { // Update to onAuthStateChanged
      if (user) {
        const db = getFirestore(); // Initialize Firestore
        const userRef = doc(db, 'users', user.uid); // Document reference
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setUser(docSnap.data());
          } else {
            console.log('No such document!'); 
          }
        } catch (error) { 
          console.log('Error getting document:', error); 
        }
      } else {
        navigate('/login');
      }
    });

    return unsubscribe; 
  }, [navigate]); 

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login after logout
    } catch (error) {
      console.log('Logout failed:', error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.name}!</h2>  {/* Use optional chaining */}
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default StudentDashboard;