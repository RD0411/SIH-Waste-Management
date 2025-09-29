import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';

const UserInfo = ({ handleLogout }) => {
  const [user, loading] = useAuthState(auth);

  // Function to get initials from display name or email
  const getInitials = () => {
    if (user && user.displayName) {
      return user.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    } else if (user && user.email) {
      return user.email[0].toUpperCase();
    }
    return 'US';
  };

  // Function to get display name
  const getDisplayName = () => {
    if (user && user.displayName) {
      return user.displayName;
    } else if (user && user.email) {
      return user.email;
    }
    return 'User';
  };

  // Function to get user role (you might want to customize this based on your app's logic)
  const getUserRole = () => {
    // This is a placeholder - you might want to get this from your database
    // or from custom claims in the user's auth token
    return "Administrator";
  };

  if (loading) {
    return (
      <div className="user-section">
        <div className="user-info">
          <div className="user-avatar-loading"></div>
          <div className="user-details">
            <div className="user-name-loading"></div>
            <div className="user-role-loading"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-section">
      <div className="user-info">
        {user && user.photoURL ? (
          <img src={user.photoURL} alt="User Avatar" className="user-avatar-img" />
        ) : (
          <div className="user-avatar">{getInitials()}</div>
        )}
        <div className="user-details">
          <div className="user-name">{getDisplayName()}</div>
          <div className="user-role">{getUserRole()}</div>
        </div>
      </div>
      <div className="user-actions">
        <button className="btn btn-outline-light">Profile</button>
        <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default UserInfo;