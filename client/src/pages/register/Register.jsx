import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import axios from "axios";

const Register = () => {

  const [inputs, setInputs]=useState({
    name:"",
    username:"",
    email:"",
    password:""
  });

  const [err, setErr]=useState(null);

  const handleChange = (e) =>{
    setInputs((prev)=>({...prev,[e.target.name]:e.target.value}));
  };

  const handleCLick = async e =>{
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
      setInputs({
        name: "",
        username: "",
        email: "",
        password: ""
      });
      setErr(null); // Clear any previous errors
    } catch (err) {
      if (err.response) {
        setErr(err.response.data);
      } else {
        setErr("An unexpected error occurred. Please try again later.");
      }
    }
  };
  
  console.log(err)

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Register</h1>
          <form>
            <input type="text" placeholder="Name" name="name" onChange={handleChange}/>
            <input type="text" placeholder="Username" name="username" onChange={handleChange}/>
            <input type="email" placeholder="Email" name="email" onChange={handleChange}/>
            <input type="password" placeholder="Password" name="password" onChange={handleChange}/>
            {err && err}
            <button onClick={handleCLick}>Register</button>
          </form>
        </div>
        <div className="right">
          <h1>Connect Sphere</h1>
          <p>Connect and share meaningful experiences with your favorite people, fostering lasting bonds and cherished memories on our platform.</p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
