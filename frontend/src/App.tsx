
import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom"


import { useContext, useEffect } from "react";
import { Context } from "./main";
import axios from "axios";
import { Navbar } from "./components/layouts/navbar";
import { Home } from "./components/pages/Home";
import { Dashboard } from "./components/pages/Dashboard";
import { Footer } from "./components/layouts/footer";
import { Login } from "./components/pages/login";
import { Register } from "./components/pages/Register";
import { Authors } from "./components/pages/Authors";
import { SingleBlog } from "./components/pages/SingleBlog";



function App() {

  
  const propDrill = useContext(Context);
 

  
  useEffect(() => {

    const fetchUser = async () => {
      
        // const data: any = await axios.get("http://localhost:4000/api/v1/user/getMyprofile");
        // propDrill?.setUser(data);
        // propDrill?.setIsAuthenticated(true);
    }

    const fetchBlogs = async () => {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/blog/getAllblogs",
        );
        propDrill?.setBlog(data.blogs);
    };

    fetchUser();
    fetchBlogs();
  }, [propDrill?.isAuthenticated, propDrill?.user]);


return (
  <>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/Register" element={<Register></Register>}></Route>
        <Route path="/authors" element={<Authors></Authors>}></Route>
        <Route path="/blog/:id" element={<SingleBlog />} />
      </Routes>
      <Footer></Footer>

    </BrowserRouter>
  </>
)
}

export default App
