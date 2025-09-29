import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './InventoryManagement.css';

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

const InventoryManagement = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);

  // Load items from Firestore on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'distributions'));
      const itemsData = [];
      querySnapshot.forEach((doc) => {
        itemsData.push({ id: doc.id, ...doc.data() });
      });
      setItems(itemsData);
    } catch (error) {
      console.error("Error fetching items: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: value
    });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (newItem.title && newItem.description) {
      setLoading(true);
      try {
        // Add a new document to the distributions collection
        const docRef = await addDoc(collection(db, 'distributions'), {
          title: newItem.title,
          description: newItem.description,
          imageUrl: newItem.imageUrl
        });
        
        console.log("Document written with ID: ", docRef.id);
        
        // Reset form and refresh items
        setNewItem({
          title: '',
          description: '',
          imageUrl: ''
        });
        
        fetchItems(); // Refresh the list
      } catch (error) {
        console.error("Error adding document: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteItem = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'distributions', id));
      console.log("Document deleted with ID: ", id);
      fetchItems(); // Refresh the list
    } catch (error) {
      console.error("Error deleting document: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inventory-container">
      <header className="inventory-header">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-recycle"></i>
            <h1>ULB Inventory Management</h1>
          </div>
          <p>Manage components made from waste materials</p>
          
        </div>
      </header>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Processing...</p>
        </div>
      )}

      <div className="content-wrapper">
        {/* Add Item Form */}
        <section className="form-section">
          <h2>Add New Component</h2>
          <form onSubmit={handleAddItem} className="inventory-form">
            <div className="form-group">
              <label htmlFor="title">Component Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newItem.title}
                onChange={handleInputChange}
                placeholder="Enter component title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={newItem.description}
                onChange={handleInputChange}
                placeholder="Describe the component and its uses"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl">Image URL (Optional)</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={newItem.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add to Inventory'}
            </button>
          </form>
        </section>

        {/* Items List */}
        <section className="list-section">
          <div className="section-header">
            <h2>Inventory Components ({items.length})</h2>
            <button onClick={fetchItems} className="refresh-btn">
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
          
          {items.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-box-open"></i>
              <p>No components added yet. Start by adding a new component.</p>
            </div>
          ) : (
            <div className="items-grid">
              {items.map(item => (
                <div key={item.id} className="item-card">
                  {item.imageUrl && (
                    <div className="item-image">
                      <img src={item.imageUrl} alt={item.title} />
                    </div>
                  )}
                  <div className="item-content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="item-actions">
                      <button 
                        onClick={() => handleDeleteItem(item.id)}
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

      {/* <div className="firebase-instructions">
        <h3>Firebase Setup Instructions</h3>
        <ol>
          <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
          <li>Create a new project or select an existing one</li>
          <li>Enable Firestore Database in your project</li>
          <li>Go to Project Settings → General → Your Apps</li>
          <li>Add a web app and copy the configuration</li>
          <li>Replace the firebaseConfig object in this code with your actual configuration</li>
        </ol>
      </div> */}
    </div>
  );
};

export default InventoryManagement;