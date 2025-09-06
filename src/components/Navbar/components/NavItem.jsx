import React, { useState } from "react";

const NavItem = ({ icon, text, active, hasDropdown, children, onClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleClick = () => {
    if (hasDropdown) setIsDropdownOpen(!isDropdownOpen);
    else if (onClick) onClick();
  };

  return (
    <li className="nav-item">
      <a
        className={`nav-link ${active ? "active" : ""} ${hasDropdown ? "dropdown-toggle" : ""}`}
        href="#"
        onClick={handleClick}
        role={hasDropdown ? "button" : undefined}
        data-bs-toggle={hasDropdown ? "dropdown" : undefined}
        aria-expanded={isDropdownOpen}
      >
        <i className={icon}></i> {text}
      </a>
      {hasDropdown && children}
    </li>
  );
};

export default NavItem;
