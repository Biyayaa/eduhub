import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
  addDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import MaterialUploadModal from "./MaterialUploadModal"; // Import the modal component

function LecturerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [courses, setCourses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to handle changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const db = getFirestore();
                const userRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    setUser(docSnap.data());
                } else {
                    console.log("No such document!");
                }

                // Fetch courses for the logged-in user
                const coursesRef = collection(db, "users", user.uid, "courses");
                const coursesQuerySnapshot = await getDocs(coursesRef);
                setCourses(coursesQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            } catch (error) {
                console.error("Error fetching user or courses:", error);
            } finally {
                setIsLoading(false); // Stop the loading state
            }

        } else { 
            // User is not logged in
            setUser(null); // Clear the user state
            setCourses([]); // Reset the courses
            navigate("/login");           
        }
    });

    return unsubscribe; // Cleanup function for the auth listener
}, [navigate]); 

  const handleCourseCreation = async (e) => {
    e.preventDefault();

    const db = getFirestore();
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);
    const coursesRef = collection(userRef, "courses"); // Reference to the user's courses subcollection

    if (!user) {
      console.error("User not logged in.");
      return;
    }

    try {
      // Add the new course to Firestore
      await addDoc(coursesRef, {
        name: newCourseName,
        description: newCourseDescription,
        createdBy: userRef,
        materials: [],
      });

      console.log("Course created successfully!");

      // Fetch the updated list of courses from Firestore
      const coursesQuerySnapshot = await getDocs(coursesRef);

      // Update the courses state with the fetched data
      setCourses(
        coursesQuerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      // Clear the input fields after creating the course
      setNewCourseName("");
      setNewCourseDescription("");
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const handleCourseClick = (courseId) => {
    console.log(courseId);
    setCurrentCourseId(courseId);
    setIsOpen(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.log("Logout failed:", error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.name}!</h2>
      {isLoading ? (
        <p>Loading user data...</p>
      ) : (
        <form onSubmit={handleCourseCreation}>
          <input
            type="text"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            placeholder="Course Title"
          />
          <input
            type="text"
            value={newCourseDescription}
            onChange={(e) => setNewCourseDescription(e.target.value)}
            placeholder="Course Description"
          />
          <button type="submit">Create Course</button>
        </form>
      )}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        
          <ul>
          {courses.map((course) => (
            <li key={course.id} onClick={() => handleCourseClick(course.id)}>
              {course.name}
            </li>
          ))}
        </ul>
    
        
      )}
      <button onClick={handleLogout}>Log Out</button>
      {isOpen && (
        <MaterialUploadModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)} // Close the modal
          courseId={currentCourseId} // Pass the current courseId to the modal
        />
      )}
    </div>
  );
}

export default LecturerDashboard;
