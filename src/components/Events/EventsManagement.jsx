import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './EventsManagement.css';

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

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    location: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);

  // Load events from Firestore on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'events'));
      const eventsData = [];
      querySnapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() });
      });
      // Sort events by date (newest first)
      eventsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (newEvent.title && newEvent.location && newEvent.date) {
      setLoading(true);
      try {
        // Add a new document to the events collection
        const docRef = await addDoc(collection(db, 'events'), {
          title: newEvent.title,
          location: newEvent.location,
          date: newEvent.date
        });
        
        console.log("Event document written with ID: ", docRef.id);
        
        // Reset form and refresh events
        setNewEvent({
          title: '',
          location: '',
          date: ''
        });
        
        fetchEvents(); // Refresh the list
      } catch (error) {
        console.error("Error adding event: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteEvent = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'events', id));
      console.log("Event document deleted with ID: ", id);
      fetchEvents(); // Refresh the list
    } catch (error) {
      console.error("Error deleting event: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="events-container">
      <header className="events-header">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-calendar-alt"></i>
            <h1>ULB Events Management</h1>
          </div>
          <p>Manage community events and activities</p>
          
        </div>
      </header>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Processing...</p>
        </div>
      )}

      <div className="content-wrapper">
        {/* Add Event Form */}
        <section className="form-section">
          <h2>Add New Event</h2>
          <form onSubmit={handleAddEvent} className="events-form">
            <div className="form-group">
              <label htmlFor="title">Event Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={newEvent.location}
                onChange={handleInputChange}
                placeholder="Enter event location"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Event Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={newEvent.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add Event'}
            </button>
          </form>
        </section>

        {/* Events List */}
        <section className="list-section">
          <div className="section-header">
            <h2>Upcoming Events ({events.length})</h2>
            <button onClick={fetchEvents} className="refresh-btn">
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
          
          {events.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-calendar-plus"></i>
              <p>No events scheduled yet. Add your first event!</p>
            </div>
          ) : (
            <div className="events-list">
              {events.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-date">
                    <div className="event-day">{new Date(event.date).getDate()}</div>
                    <div className="event-month">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                  </div>
                  <div className="event-content">
                    <h3>{event.title}</h3>
                    <p className="event-location">
                      <i className="fas fa-map-marker-alt"></i> {event.location}
                    </p>
                    <p className="event-full-date">
                      <i className="fas fa-clock"></i> {formatDate(event.date)}
                    </p>
                    <div className="event-actions">
                      <button 
                        onClick={() => handleDeleteEvent(event.id)}
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

export default EventsManagement;