import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './TrainingManagement.css';

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyBr44ELiMhReF2swR4lNThm1q959_1W7d0",
  authDomain: "wastemanagement-5886b.firebaseapp.com",
  projectId: "wastemanagement-5886b",
  storageBucket: "wastemanagement-5886b.firebasestorage.app",
  messagingSenderId: "536287026211",
  appId: "1:536287026211:web:336cd0b3ca221bc368a596",
  measurementId: "G-KZG0ZYQ2W6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TrainingManagement = () => {
  const [trainings, setTrainings] = useState([]);
  const [newTraining, setNewTraining] = useState({
    title: '',
    description: '',
    videoUrl: ''
  });
  const [loading, setLoading] = useState(false);

  // Load trainings from Firestore on component mount
  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'trainings'));
      const trainingsData = [];
      querySnapshot.forEach((doc) => {
        trainingsData.push({ id: doc.id, ...doc.data() });
      });
      setTrainings(trainingsData);
    } catch (error) {
      console.error("Error fetching trainings: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTraining({
      ...newTraining,
      [name]: value
    });
  };

  const handleAddTraining = async (e) => {
    e.preventDefault();
    if (newTraining.title && newTraining.description) {
      setLoading(true);
      try {
        // Add a new document to the trainings collection
        const docRef = await addDoc(collection(db, 'trainings'), {
          title: newTraining.title,
          description: newTraining.description,
          videoUrl: newTraining.videoUrl,
          createdAt: new Date()
        });
        
        console.log("Training document written with ID: ", docRef.id);
        
        // Reset form and refresh trainings
        setNewTraining({
          title: '',
          description: '',
          videoUrl: ''
        });
        
        fetchTrainings(); // Refresh the list
      } catch (error) {
        console.error("Error adding training: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteTraining = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'trainings', id));
      console.log("Training document deleted with ID: ", id);
      fetchTrainings(); // Refresh the list
    } catch (error) {
      console.error("Error deleting training: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="trainings-container">
      <header className="trainings-header">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-chalkboard-teacher"></i>
            <h1>ULB Training Management</h1>
          </div>
          <p>Manage training materials and educational content</p>
          
        </div>
      </header>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Processing...</p>
        </div>
      )}

      <div className="content-wrapper">
        {/* Add Training Form */}
        <section className="form-section">
          <h2>Add New Training</h2>
          <form onSubmit={handleAddTraining} className="trainings-form">
            <div className="form-group">
              <label htmlFor="title">Training Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newTraining.title}
                onChange={handleInputChange}
                placeholder="Enter training title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={newTraining.description}
                onChange={handleInputChange}
                placeholder="Enter detailed training description"
                rows="6"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="videoUrl">YouTube Video URL (Optional)</label>
              <input
                type="url"
                id="videoUrl"
                name="videoUrl"
                value={newTraining.videoUrl}
                onChange={handleInputChange}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add Training'}
            </button>
          </form>
        </section>

        {/* Trainings List */}
        <section className="list-section">
          <div className="section-header">
            <h2>Training Materials ({trainings.length})</h2>
            <button onClick={fetchTrainings} className="refresh-btn">
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
          
          {trainings.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-video-slash"></i>
              <p>No training materials added yet. Add your first training!</p>
            </div>
          ) : (
            <div className="trainings-list">
              {trainings.map(training => (
                <div key={training.id} className="training-card">
                  <div className="training-content">
                    <h3>{training.title}</h3>
                    <p className="training-description">{training.description}</p>
                    
                    {training.videoUrl && (
                      <div className="video-container">
                        <h4>Training Video:</h4>
                        <div className="video-wrapper">
                          <iframe
                            width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/${getYouTubeId(training.videoUrl)}`}
                            title={training.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <a href={training.videoUrl} target="_blank" rel="noopener noreferrer" className="video-link">
                          Watch on YouTube <i className="fas fa-external-link-alt"></i>
                        </a>
                      </div>
                    )}
                    
                    <div className="training-actions">
                      <button 
                        onClick={() => handleDeleteTraining(training.id)}
                        className="delete-btn"
                        disabled={loading}
                      >
                        <i className="fas fa-trash"></i> Remove
                      </button>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      
    </div>
  );
};

export default TrainingManagement;