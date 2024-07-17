import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import "../modal/modal.scss";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from 'react-router-dom';

export default function Modal({setModalOpen}) {
  const navigate=useNavigate();
  const handleLogout = () => {
    setModalOpen(false);
    localStorage.clear();
    navigate("/login"); // Navigate to "/login" route
  };
  return (
    <div className="darkBg" onClick={()=>setModalOpen(false)}>
      <div className="centered">
        <div className='modal' onClick={(e) => e.stopPropagation()}>
          <div className="modalHeader">
            <h5 className='heading'>Confirm</h5>
          </div>
          <CloseIcon style={{cursor: "pointer", fontWeight:"500", padding:"4px 8px",borderRadius:"2px", border:"none", fontSize:"18px", color:"white",backgroundColor:"rgb(10, 60, 223)", transition:"all 0.25 ease", boxShadow:"0 5px 20px 0 rgba(0,0,0,0.06)", position:"absolute",right:"0",top:"0",alignSelf:"flex-end",marginTop:"-7px",marginRight:"-7px"}}
          onClick={()=>setModalOpen(false)}
          />
          <div className="modalContent">
            Do you really want to logout?
          </div>
          <div className="modalActions">
            <div className="actionsContainer">
              <button className='logOutBtn' onClick={handleLogout}>Log out</button>
              <button className='cancelBtn' onClick={()=>setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
