import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import NavItem from "./components/NavItem";
import DropdownMenu from "./components/DropdownMenu";
import DropdownItem from "./components/DropdownItem";
import UserInfo from "./components/UserInfo";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Navbar = ({ activeItem, setActiveItem }) => {
  const navigate = useNavigate();

  const handleNavClick = (itemName, path) => {
    setActiveItem(itemName);
    if (path) navigate(path);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="navbar navbar-dark bg-dark" aria-label="Main navigation">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <a className="navbar-brand" href="#">
          <div className="brand-icon">
            <i className="fas fa-rocket"></i>
          </div>
          ULB Operator Portal
        </a>

        <div className="d-none d-md-flex">
          <button className="btn btn-outline-light btn-sm me-2">
            <i className="fas fa-bell"></i>
          </button>
          <button className="btn btn-outline-light btn-sm me-2">
            <i className="fas fa-cog"></i>
          </button>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div
          className="offcanvas offcanvas-start text-bg-dark"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                Menu
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>

          <div className="offcanvas-body d-flex flex-column">
            <ul className="navbar-nav justify-content-end flex-grow-1">
              <NavItem
                icon="fas fa-home"
                text="Dashboard"
                active={activeItem === "dashboard"}
                onClick={() => handleNavClick("dashboard", "/")}
              />
              <NavItem
                icon="fas fa-truck"
                text="Fleet Management"
                active={activeItem === "fleet"}
                onClick={() => handleNavClick("fleet", "/fleet")}
              />
              <NavItem
                icon="fas fa-flag"
                text="Issue Resolution"
                active={activeItem === "issues"}
                onClick={() => handleNavClick("issues", "/issues")}
              />
              <NavItem
                icon="fas fa-gavel"
                text="Enforcement"
                active={activeItem === "enforcement"}
                onClick={() => handleNavClick("enforcement", "/enforcement")}
              />
              <NavItem
                icon="fas fa-users"
                text="Green Champions"
                active={activeItem === "champions"}
                onClick={() => handleNavClick("champions", "/champions")}
              />
              <NavItem
                icon="fas fa-chart-line"
                text="Reports & Analytics"
                active={activeItem === "analytics"}
                onClick={() => handleNavClick("analytics", "/analytics")}
              />
            </ul>

            <form className="search-form mt-3">
              <div className="input-group">
                <input
                  className="form-control"
                  type="search"
                  placeholder="Search..."
                  aria-label="Search"
                />
                <button className="btn btn-primary" type="submit">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>

            <UserInfo handleLogout={handleLogout}/>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
