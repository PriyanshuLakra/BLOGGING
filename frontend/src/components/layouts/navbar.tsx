import { useContext, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import axios from "axios";
import { toast } from 'react-hot-toast';

type NavbarProps = {
    children?: React.ReactNode;
  };

  
export const Navbar:React.FC<NavbarProps> = () => {

    const [show, setShow] = useState(false);

    const handleNavbar = () => {
        setShow(!show)
    }
    const location = useLocation();
    const navigateTo = useNavigate();
    const propDrill = useContext(Context);

    

    const handlelogout = async(e:any)=>{

        e.preventDefault();
        try{
            await axios.get("http://localhost:4000/api/v1/user/logout");
            propDrill?.setIsAuthenticated(false);
            toast.success("Succesfully logout")
            localStorage.setItem('token' , "");
            navigateTo("/")
        } catch (error){
            toast.error("error while log out");
            
        }
    }
    return (
        <section className={location.pathname === "/dashboard" ? "hideNavbar" : propDrill?.mode === 'light' ? "header light-navbar" : "header dark-navbar"}>

            <nav>
                <div className="logo">
                    Zeta<span>Blog</span>
                </div>

                <div className={show ? "links show" : "links"}>
                    <ul>
                        <li>
                            <Link to={"/"} onClick={handleNavbar}>HOME</Link>
                        </li>
                        <li>
                            <Link to={"/blogs"} onClick={handleNavbar}>BLOGS</Link>
                        </li>
                        <li>
                            <Link to={"/authors"} onClick={handleNavbar}>
                                ALL AUTHORS
                            </Link>
                        </li>
                        <li>
                            <Link to={"/about"} onClick={handleNavbar}>
                                ABOUT
                            </Link>
                        </li>
                    </ul>
                    <div className="btns">
                        <button onClick={() => propDrill?.mode === "light" ? propDrill?.setMode("dark") : propDrill?.setMode("light")} className={propDrill?.mode === "light" ? "mode-btn light-mode" : "mode-btn dark-mode"}>

                            {propDrill?.mode === "light" ? (
                                <CiLight className="light-icon" />
                            ) : (
                                <MdDarkMode className="dark-icon" />
                            )}
                        </button>
                        {propDrill?.isAuthenticated && propDrill?.user.role === "Author" ? (
                            <Link
                            to={"/dashboard"}
                            onClick={handleNavbar}
                            className="dashboard-btn"
                          >
                            DASHBOARD
                          </Link>
                        ) :(
                            ""
                        )}

                        {!propDrill?.isAuthenticated && localStorage.getItem('token')=="" ? (
                            <Link to={"/login"} onClick={handleNavbar} className="login-btn">LOGIN</Link>
                        ) : (
                            <div>
                                <button className="logout-btn" onClick={handlelogout}>LOGOUT</button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>



        </section>
    )










}