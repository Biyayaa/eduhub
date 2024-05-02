import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function StudentDashboard() {
    const [user, setUser] = useState(null); 
    const [availableCourses, setAvailableCourses] = useState([]); 
    const [isLoading, setIsLoading] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const db = getFirestore();
                    const userRef = doc(db, 'users', user.uid); 
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
                setUser(null); // Clear user state
                navigate('/login');
            }
        });

        return unsubscribe; 
    }, [navigate]); 

    useEffect(() => { 
      const fetchCourses = async () => { 
          setIsLoading(true);
  
          try {
              const db = getFirestore();
  
              // Collection of all courses (nested within user documents)
              const courses = await getDocs(collection(db, `users`)); 
  
              const allCourses = await Promise.all(
                  courses.docs.map(async (userDoc) => {
                      const userCoursesRef = collection(userDoc.ref, 'courses');
                      const userCoursesSnapshot = await getDocs(userCoursesRef);
  
                      return userCoursesSnapshot.docs.map((courseDoc) => ({
                          id: courseDoc.id,
                          ...courseDoc.data(),
                      }));
                  })
              );
  
              setAvailableCourses(allCourses.flat()); // Flatten nested arrays
          } catch (error) {
              console.error("Error fetching courses:", error);
          } finally {
              setIsLoading(false); 
          }
      };
  
      fetchCourses(); 
  }, []); 

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.log('Logout failed:', error.message);
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Welcome, {user?.name}!</h2> 

            {isLoading ? (
                <p>Loading courses...</p>
            ) : ( 
                <div className="courses-list">
                    <h3>Available Courses</h3>
                    <ul>
                        {availableCourses.map(course => (
                            <li key={course.id}>
                                <h3>{course.name}</h3>
                                <p>{course.description}</p>
                                {/* Add buttons for enrollment or viewing details here */} 
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
}

export default StudentDashboard; 