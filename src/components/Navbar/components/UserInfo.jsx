import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";

const UserInfo = ({handleLogout}) => {
	return (
		<div className="user-section">
			<div className="user-info">
				<div className="user-avatar">JS</div>
				<div className="user-details">
					<div className="user-name">John Smith</div>
					<div className="user-role">Administrator</div>
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
