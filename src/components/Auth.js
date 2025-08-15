import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AuthContext from "../contexts/AuthContext";
import { CircularProgress, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  
  const toggleVisible = () => {
    setVisible(!visible);
  };

  const notify = (message, type) => {
    if (type === "error") {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  // Signup state
  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "male",
    password: "",
    cpassword: "",
  });

  // Handle input change for signup
  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  // Signup 
  const postData = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();
      
      if (res.ok) {
        notify("Registration successful. Please login to enter", "success");
        setTimeout(() => {
          toggleVisible();
        }, 1500);
      } else {
        notify(data.message || "Registration failed", "error");
      }
    } catch (error) {
      console.error("Signup error:", error);
      notify("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Login state
  const [lguser, setLgUser] = useState({
    email: "",
    password: "",
  });

  // Handle input change for login
  const LoginInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setLgUser({ ...lguser, [name]: value });
  };

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lguser),
      });

      const data = await res.json();
      
      if (res.ok) {
        notify("Login successful", "success");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        login(data.user, data.token);
        // Navigate immediately after successful login
        navigate("/home");
      } else {
        notify(data.message || "Login failed", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      notify("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#000] flex justify-center items-center relative">
      <div className="w-10/12 h-10/12 text-[white] flex flex-row ">
        <div className="leftdiv w-1/2 h-[80vh]">
          <div className={`login w-full h-full flex justify-center items-center bgblackAuth ${visible ? "hidden" : "flex"}`}>
            <div className="w-10/12 h-full flex flex-col gap-12 justify-center">
              <div className="first flex flex-col">
                <span className="text-4xl font-bold">Login</span>
                <span className="text-lg font-md">Enter your account details</span>
              </div>
              <div className="w-full">
                <form method="POST" className="bg-transparent flex flex-col gap-3">
                  <div className="input-box">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email"
                      value={lguser.email}
                      onChange={LoginInput}
                      required
                      className="bg-transparent w-8/12 h-10 border-b-[1px] border-[#D9D9D9]"
                    />
                  </div>
                  <div className="input-box">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Password"
                      value={lguser.password}
                      onChange={LoginInput}
                      required
                      className="bg-transparent w-8/12 h-10 border-b-[1px] border-[#D9D9D9]"
                    />
                  </div>
                  <div className="link my-5 text-[#6d6d6d] font-medium cursor-pointer">
                    <Link to="/forgot_password" style={{ textDecoration: 'none' }}>
                      <Typography variant="body2" color="primary">
                        Forgot Password?
                      </Typography>
                    </Link>
                  </div>
                  <div>
                    <button
                      type="submit"
                      onClick={handleLogin}
                      className="w-8/12 h-10 bg-[#9C6FE4] rounded-lg text-lg font-semibold"
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : <span>Login</span>}
                    </button>
                  </div>
                </form>
              </div>
              <div className="flex flex-row gap-12 mt-7 items-center">
                <span>Dont have an account ?</span>
                <button
                  className="text-md font-medium w-24 h-10 bg-[#333437] rounded-md"
                  onClick={toggleVisible}
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="rightdiv w-1/2 h-[80vh]">
          <div className={`signup w-full h-full flex justify-center items-center bgblackAuth ${visible ? "flex" : "hidden"} transition-all duration-700`}>
            <div className="w-10/12 h-full flex flex-col gap-12 justify-center">
              <div className="first flex flex-col">
                <span className="text-4xl font-bold">Sign Up</span>
                <span className="text-lg font-md">Enter your details</span>
              </div>
              <div className="w-full">
                <form method="POST" className="bg-transparent flex flex-col gap-3">
                  <div className="input-box">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Name"
                      required
                      value={user.name}
                      onChange={handleInput}
                      className="bg-transparent w-8/12 h-10 border-b-[1px] border-[#D9D9D9]"
                    />
                  </div>
                  <div className="input-box">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      placeholder="Phone Number"
                      required
                      value={user.phone}
                      onChange={handleInput}
                      className="bg-transparent w-8/12 h-10 border-b-[1px] border-[#D9D9D9]"
                    />
                  </div>
                  <div className="input-box">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email"
                      required
                      value={user.email}
                      onChange={handleInput}
                      className="bg-transparent w-8/12 h-10 border-b-[1px] border-[#D9D9D9]"
                    />
                  </div>
                  <div className="input-box">
                    <select
                      name="gender"
                      id="gender"
                      value={user.gender}
                      onChange={handleInput}
                      className="bg-transparent w-8/12 h-10 border-b-[1px] border-[#D9D9D9] text-white"
                      required
                    >
                      <option value="male" className="bg-gray-800">Male</option>
                      <option value="female" className="bg-gray-800">Female</option>
                      <option value="other" className="bg-gray-800">Other</option>
                    </select>
                  </div>
                  <div className="input-box">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Password"
                      required
                      value={user.password}
                      onChange={handleInput}
                      className="bg-transparent w-8/12 h-10 border-b-[1px] border-[#D9D9D9]"
                    />
                  </div>
                  <div className="input-box">
                    <input
                      type="password"
                      name="cpassword"
                      id="cpassword"
                      placeholder="Confirm Password"
                      required
                      value={user.cpassword}
                      onChange={handleInput}
                      className="bg-transparent w-8/12 h-10 border-b-[1px] border-[#D9D9D9]"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      onClick={postData}
                      className="w-8/12 h-10 bg-[#9C6FE4] rounded-lg text-lg font-semibold"
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : <span>Sign up</span>}
                    </button>
                  </div>
                </form>
              </div>
              <div className="flex flex-row gap-12 mt-7 items-center">
                <span>Already have an account ?</span>
                <button
                  className="text-md font-medium w-24 h-10 bg-[#333437] rounded-md"
                  onClick={toggleVisible}
                >
                  Log in
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={`bgcolorAuth w-2/5 h-[80vh] absolute transition duration-300 ${visible ? 'transform translate-x-6' : 'transform translate-x-full'}`}>
        </div> 
        
      </div>
      <Toaster />
    </div>
  );
};

export default Auth;