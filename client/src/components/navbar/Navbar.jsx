import "./navbar.scss";
import { Link, Navigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useContext, useState, useEffect, useRef } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import LogoutIcon from '@mui/icons-material/Logout';
import Modal from "../modal/Modal";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, setModalOpen } = useContext(AuthContext);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const searchRef = useRef();

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.length > 0) {
      try {
        const res = await axios.get(`http://localhost:8800/api/search?q=${query}`, { withCredentials: true });
        setSearchResults(res.data);
      } catch (err) {
        console.log(err);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (userId) => {
    navigate(`/profile/${userId}`);
    setSearchResults([]);  // Clear search results
    setSearchTerm("");  // Clear search input
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSearchResults([]);
      setSearchTerm("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>ConnectSphere</span>
        </Link>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "inherit"
          }}>
          <HomeIcon style={{ color: "inherit" }} />
        </Link>
        {darkMode ? <LightModeIcon onClick={toggle} /> : <DarkModeIcon onClick={toggle} />}
        <div className="search" ref={searchRef}>
          <SearchRoundedIcon />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchResults.length > 0 && (
            <div className="searchResults">
              {searchResults.map(user => (
                <div
                  key={user.userId}
                  className="searchResult"
                  onClick={() => handleResultClick(user.userId)}
                >
                  <img src={"/upload/" + user.profilePic} alt={user.name} />
                  <span>{user.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="right">
        <LogoutIcon style={{ cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", color: "inherit" }} onClick={() => setModalOpen(true)} />
        <div className="user">
          {currentUser && (
            <Link to={`/profile/${currentUser.id}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", color: "inherit" }}>
              <img src={"/upload/" + currentUser.profilePic} alt="" />
              <span>{currentUser.name}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
