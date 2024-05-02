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

    // Authentication state management
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

    // Fetch courses with nested materials
    useEffect(() => { 
        const fetchCourses = async () => { 
            setIsLoading(true);

            try {
                const db = getFirestore();
                const courses = await getDocs(collection(db, `users`)); // Fetch all user documents

                const allCourses = await Promise.all(
                    courses.docs.map(async (userDoc) => {
                        const userCoursesRef = collection(userDoc.ref, 'courses');
                        const userCoursesSnapshot = await getDocs(userCoursesRef);

                        return await Promise.all( // Fetch materials for each course
                            userCoursesSnapshot.docs.map(async (courseDoc) => {
                                const courseMaterialsRef = collection(courseDoc.ref, 'course_materials');
                                const courseMaterialsSnapshot = await getDocs(courseMaterialsRef);

                                return {
                                    id: courseDoc.id,
                                    ...courseDoc.data(),
                                    materials: courseMaterialsSnapshot.docs.map(materialDoc => materialDoc.data())
                                };
                            })
                        );
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

                                {course.materials.length > 0 ? (
                                    <>
                                        <h4>Course Materials:</h4>
                                        <ul>
                                            {course.materials.map(material => (
                                                <li key={material.name}>
                                                    <a href={material.downloadURL} target="_blank" rel="noopener noreferrer">{material.name}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <p>No materials available for this course</p>
                                )}
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