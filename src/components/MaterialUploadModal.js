import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";

function MaterialUploadModal({ isOpen, onClose, courseId }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async () => {
    try {
      const storage = getStorage(); 
      const storageRef = ref(storage, `materials/${courseId}/${selectedFile.name}`); 

      const uploadTask = uploadBytes(storageRef, selectedFile); 

      uploadTask.on('state_changed', 
        (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        (error) => console.error('Error uploading file:', error),
        async () => { 
          const downloadURL = await getDownloadURL(storageRef);
          // Update in Firestore
          const db = getFirestore();
          const courseRef = doc(db, 'courses', courseId);
          await updateDoc(courseRef, {
            materials: arrayUnion({
              name: selectedFile.name,
              downloadURL: downloadURL,
              courseID: courseId
            })
          });
          setSelectedFile(null); // Reset selected file 
          setUploadProgress(0); // Reset progress
        }
      );

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
      </div>
    </div>
  );
}

export default MaterialUploadModal;
