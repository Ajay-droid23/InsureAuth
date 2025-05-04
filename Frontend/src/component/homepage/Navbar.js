


import logo from "./images/logo-text.png";
import Hamburger from 'hamburger-react';
import { useState } from "react";
import Nav2 from "./Nav2";
import { useNavigate } from 'react-router-dom';



const Navbar = ({ toggleLoginForm }) => {
  const [isOpen, setOpen] = useState(false);

  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate('/login');
  };


  return (
    <div>
      <div className='home_nav '>
        <nav className='main_nav'>
          <a href="/"><img src={logo} alt="logo" className="hid" /></a>
          <div className="navlinks_div nav_left">
            <ul  style={{marginRight:'-60px'}}lassName="navlinks">
              <li><a href="/"><img src={logo} className="logoo"  alt="logo" width={150} height={35} /></a></li>
            </ul>
          </div>
          <div className="btn-gg">
          <a className="signup-btn " onClick={() => navigate("/signupp")}>Sign up</a>
          <a className="signup-btn" onClick={() => navigate("/loginn")}>Log in</a>

          </div>
   
          <div className="hamburger-menu">
            <Hamburger toggled={isOpen} toggle={setOpen} duration={0.8} size={20} />
            <a href="#" className="" onClick={() => setOpen(!setOpen)}></a>
          </div>
        </nav>
      </div>
      {isOpen ? <Nav2 /> : null}
    </div>
  );
}

export default Navbar;