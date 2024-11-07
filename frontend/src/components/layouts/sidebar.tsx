import { useContext, useState } from "react";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaArrowLeft } from "react-icons/fa";
import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";


type SideBarprops = {
    component:string,
    setComponent:React.Dispatch<React.SetStateAction<string>>,
    children?: React.ReactNode;
   
  };

export const SideBar:React.FC<SideBarprops> = ({setComponent})=>{

    const [show , setShow] = useState(false);

    const propDrill = useContext(Context)

    const navigateTo = useNavigate();



    const gotoHome=()=>{
      navigateTo("/");
    }

    const handleComponent = (value:string)=>{
      setComponent(value)
    }

    const handleLogout = async (e:any)=>{

      e.preventDefault()

      const {data} = await axios.get("http://localhost:4000/api/v1/user/logout");
      localStorage.removeItem("token")
      propDrill?.setIsAuthenticated(false);
      toast.success(data.message);
      navigateTo("/");
    }


    return  <>
      <div className="icon-wrapper" onClick={() => setShow(!show)}>
        <RxHamburgerMenu />
      </div>
      <section className={show ? "show-sidebar sidebar" : "sidebar"}>
        <div className="icon-wrapper-arrow" onClick={() => setShow(!show)}>
          <FaArrowLeft />
        </div>
        <div className="user-detail">
          <img src={propDrill?.user && propDrill?.user.avatar.url} alt="avatar" />
          <p>{propDrill?.user.name}</p>
        </div>
        <ul>
          <button onClick={() => handleComponent("My Blogs")}>MY BLOGS</button>
          <button onClick={() => handleComponent("Create Blog")}>
            CREATE BLOG
          </button>
          <button onClick={() => handleComponent("Analytics")}>
            CHART
          </button>
          <button onClick={() => handleComponent("My Profile")}>
            MY PROFILE
          </button>
          <button onClick={gotoHome}>HOME</button>
          <button onClick={handleLogout}>LOGOUT</button>
          <button
            onClick={() =>
              propDrill?.mode === "light" ? propDrill?.setMode("dark") : propDrill?.setMode("light")
            }
            className={
              propDrill?.mode === "light" ? "mode-btn light-mode" : "mode-btn dark-mode"
            }
          >
            {propDrill?.mode === "light" ? (
              <CiLight className="light-icon" />
            ) : (
              <MdDarkMode className="dark-icon" />
            )}
          </button>
        </ul>
      </section>
    </>

    
}