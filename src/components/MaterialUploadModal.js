import React, { useState, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { getFirestore, collection, addDoc,  getDocs } from "firebase/firestore";
import "./MaterialUploadModal.css";


function MaterialUploadModal({ isOpen, onClose, courseId }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    // Fetch materials for the course
    const fetchMaterials = async () => {
      try {
        const db = getFirestore();
        const courseMaterialsRef = collection(db, `courses/${courseId}/course_materials`);
        const materialsQuerySnapshot = await getDocs(courseMaterialsRef);
        const materialList = materialsQuerySnapshot.docs.map(doc => doc.data());
        setMaterials(materialList);
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };
    fetchMaterials();
  }, [isOpen, courseId]);

  const handleFileUpload = async () => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `materials/${courseId}/${selectedFile.name}`);
    
      // Upload the file
      const uploadTaskSnapshot = await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
    
      // Update Firestore with the download URL
      const db = getFirestore();
      const courseMaterialsRef = collection(db, `courses/${courseId}/course_materials`);
      
      // Add the material to the "course materials" subcollection
      await addDoc(courseMaterialsRef, {
        name: selectedFile.name,
        downloadURL: downloadURL,
      });
  
      console.log('File uploaded and Firestore updated successfully.');
    
      // Reset selected file and progress
      setSelectedFile(null);
      setUploadProgress(0);
    
    } catch (error) {
      console.error('Error uploading and updating:', error);
    }
  }

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
        {uploadProgress > 0 && <p>Upload Progress: {uploadProgress.toFixed(1)}%</p>} 
        <button onClick={handleFileUpload}>Upload</button>

        <h3>Uploaded Materials:</h3>
        <ul>
          {materials.map((material, index) => (
            <li key={index}>
              <a href={material.downloadURL} target="_blank" rel="noopener noreferrer">{material.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MaterialUploadModal;
