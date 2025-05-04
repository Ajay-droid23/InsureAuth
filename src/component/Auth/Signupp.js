// import React, { useState } from "react";
// import { useNavigate ,Link} from "react-router-dom";
// import './Auth.css'; // Import the CSS file for styling


// function Signupp() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState({
//     name: "",
//     email: "",
//     contact: "",
//     gender: "",
//     role: "customer",
//     password: "",
//     confirmPassword: "",
//     adminCode: "insadmin", 
//   });

//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setUser({ ...user, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

   
//     if (!user.name || !user.email || !user.contact || !user.gender || !user.password || !user.confirmPassword) {
//       setError("All fields are required.");
//       return;
//     }
//     if (user.password !== user.confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }
//     if (user.password.length < 6){
//       setError("Password length is less")
//       return;
//     }
//     if (user.role === "admin" && user.adminCode !== "insadmin") { 
//       setError("Invalid admin code.");
//       return;
//     }

  
//     localStorage.setItem("user", JSON.stringify(user));
//     navigate("/loginn");
//   };


  
//       try {
//           const response = await axios.post('http://localhost:5000/signup', user);
//           console.log(response.data);
//           navigate("/loginn");
//         }
//      catch (error) {
//           console.error('Error submitting form', error);
//           setError("Error submitting form");
//         }
  
    
//   return (
//     <div>
//       <div  style={{marginTop:'26px'}}>
//         <Link className="bk btn-primary" to="/">Back</Link>
//       </div>
//     <div className="auth-container d-flex" style={{height:'200vh', marginTop:'-200px'}}>
      
//       <div className="auth-box signup-form">
//         <h2 style={{textAlign:"center"}}>Register</h2>
//         {error && <div className="alert alert-danger">{error}</div>}
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <input
//               type="text"
//               name="name"
//               className="form-control"
//               placeholder="Name"
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <input
//               type="email"
//               name="email"
//               className="form-control"
//               placeholder="Email"
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <input
//               type="tel"
//               name="contact"
//               className="form-control"
//               placeholder="Vehicle Reg no"
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <select
//               name="gender"
//               className="form-control"
//               onChange={handleChange}
//               required
//             >
//               <option className="text-muted" value="">--Select Gender--</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <select
//               name="role"
//               className="form-control"
//               onChange={handleChange}
//               required
//             >
//                  <option className="text-muted" value="">--Select Role--</option>
//               <option value="customer">Customer</option>
//               <option value="agent">Agent</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>
//           {user.role === "admin" && (
//             <div className="form-group">
//               <input
//                 type="text"
//                 name="adminCode"
//                 className="form-control"
//                 placeholder="Admin Code"
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           )}
//           <div className="form-group">
//             <input
//               type="password"
//               name="password"
//               className="form-control"
//               placeholder="Password"
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <input
//               type="password"
//               name="confirmPassword"
//               className="form-control"
//               placeholder="Confirm Password"
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <button className="btn btn-primary w-100" type="submit">Sign Up</button>
//         </form>
//         <p className="mt-3 text-muted">
//           Already have an account? <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/loginn")}>Log In</span>
//         </p>
//       </div>
//       <div class="img-hid">
//         <img src="https://cdn3d.iconscout.com/3d/premium/thumb/car-insurance-9476436-7767110.png" />
//       </div>
//     </div>
//     </div>
//   );
// }

// export default Signupp;


import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import './Auth.css'; // Import the CSS file for styling

function Signupp() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    contact: "",
    gender: "",
    role: "customer",
    password: "",
    confirmPassword: "",
    adminCode: "insadmin", 
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.name || !user.email || !user.contact || !user.gender || !user.password || !user.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (user.password.length < 6) {
      setError("Password length is less");
      return;
    }
    if (user.role === "admin" && user.adminCode !== "insadmin") { 
      setError("Invalid admin code.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signupp', user);
      console.log(response.data);
      navigate("/loginn");
    } catch (error) {
      console.error('Error submitting form', error);
      setError("Error submitting form");
    }
  };

  return (
    <div>
      <div style={{ marginTop: '26px' }}>
        <Link className="bk btn-primary" to="/">Back</Link>
      </div>
      <div className="auth-container d-flex" style={{ height: '200vh', marginTop: '-200px' }}>
        <div className="auth-box signup-form">
          <h2 style={{ textAlign: "center" }}>Register</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Name"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Email"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                name="contact"
                className="form-control"
                placeholder="Vehicle Reg no"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <select
                name="gender"
                className="form-control"
                onChange={handleChange}
                required
              >
                <option className="text-muted" value="">--Select Gender--</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="form-group">
              <select
                name="role"
                className="form-control"
                onChange={handleChange}
                required
              >
                <option className="text-muted" value="">--Select Role--</option>
                <option value="customer">Customer</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {user.role === "admin" && (
              <div className="form-group">
                <input
                  type="text"
                  name="adminCode"
                  className="form-control"
                  placeholder="Admin Code"
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="form-group">
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Confirm Password"
                onChange={handleChange}
                required
              />
            </div>
            <button className="btn btn-primary w-100" type="submit">Sign Up</button>
          </form>
          <p className="mt-3 text-muted">
            Already have an account? <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/loginn")}>Log In</span>
          </p>
        </div>
        <div className="img-hid">
          <img src="https://cdn3d.iconscout.com/3d/premium/thumb/car-insurance-9476436-7767110.png" alt="Car Insurance" />
        </div>
      </div>
    </div>
  );
}

export default Signupp;
