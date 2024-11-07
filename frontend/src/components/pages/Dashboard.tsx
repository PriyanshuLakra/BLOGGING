import { useContext, useState } from "react"
import { Context } from "../../main"

import { Navigate } from "react-router-dom";

import { MyProfile } from "../mini_components/MyProfile";
import { CreateBlog } from "../mini_components/CreateBlog";
import { Chart } from "../mini_components/Chart";
import { MyBlogs } from "../mini_components/MyBlogs";
import { SideBar } from "../layouts/sidebar";


export const Dashboard = ()=>{

    const propDrill = useContext(Context)
    if(!localStorage.getItem("token") || propDrill?.user.role === "READER"){
        return <Navigate to={"/"} />;
    }


    const [component , setComponent] = useState("MyBlogs");




    return (
        <section className={propDrill?.mode === "dark" ? "dark-bg dashboard" : "light-bg dashboard"}>

            <SideBar component={component} setComponent={setComponent}></SideBar>
            {component === "MyProfile" ? (
                <MyProfile></MyProfile>
            ) : component === "Create Blog" ? (
                <CreateBlog></CreateBlog>
            ) : component === "Analytics" ? (
                <Chart></Chart>
            ) :(
                <MyBlogs></MyBlogs>
            )}

        </section>
    )
}
