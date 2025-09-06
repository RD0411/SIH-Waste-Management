import React from "react";

const DropdownItem = ({ text, onClick }) => {
  return (
    <li>
      <a className="dropdown-item" href="#" onClick={onClick}>
        {text}
      </a>
    </li>
  );
};

export default DropdownItem;
