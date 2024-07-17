import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { useState } from "react";

const Login = () => {

  const [inputs, setInputs]=useState({
    username:"",
    password:""
  });

  const [err, setErr]=useState(null);

  const navigate = useNavigate();

  const handleChange = (e) =>{
    setInputs((prev)=>({...prev,[e.target.name]:e.target.value}))
  };

  const {login}=useContext(AuthContext);

  const handleLogin= async (e) =>{
    e.preventDefault();
    try{
      await login(inputs);
      navigate("/");
    }catch(err){
      console.log(err);  // Log the error to understand its structure
      if (err.response && err.response.data) {
        setErr(err.response.data);
      } else {
        setErr("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Hello World.</h1>
          <p>Join to connect and share experiences with the people you care about. Build meaningful relationships and stay in touch with your favorite folks. Together, we create lasting memories.</p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input type="text" placeholder="Username" name="username" onChange={handleChange}/>
            <input type="password" placeholder="Password" name="password" onChange={handleChange}/>
            {err && err}
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
