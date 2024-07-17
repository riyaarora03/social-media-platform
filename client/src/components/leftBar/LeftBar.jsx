import "./leftBar.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";

const LeftBar = () => {

  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <Link
              to={`/profile/${currentUser.id}`}
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <img src={"/upload/"+currentUser.profilePic} alt="" />
              <span>Profile</span>
            </Link>
          </div>
          {/* <div className="item">
            <img
              src={
                "https://img.icons8.com/?size=100&id=J6pBf3G6DZGM&format=png&color=000000"
              }
              alt=""
            />
            <span>Messages</span>
          </div> */}
          <div className="item">
          <Link
              to={`/explore`}
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
            <img
              src={
                "https://img.icons8.com/?size=100&id=uHuD6VI5HlWw&format=png&color=06d001"
              }
              alt=""
            />
            <span>Explore</span>
            </Link>
          </div>
          
          <div className="item">
          <Link
              to={`/recommendations`}
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
            <img
              src={
                "https://img.icons8.com/?size=100&id=20445&format=png&color=000000"
              }
              alt=""
            />
            <span>Recommendations</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
