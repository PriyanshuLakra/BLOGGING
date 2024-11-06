import { useContext } from "react"
import { Context } from "../../main"
import { HeroSection } from "../mini_components/HeroSection";
import { PopularAuthors } from "../mini_components/PopularAuthors";
import { TrendingBlogs } from "../mini_components/TrendingBlogs";
// import { LatestBlogs } from "../mini_components/LatestBlogs";


export const Home = () =>{

    const propDrill = useContext(Context);

    // const filteredBlogs = propDrill?.blog.slice(0,6);
    return <>
    <article className={propDrill?.mode === "dark" ? "dark-bg" : "light-bg"}>
      <HeroSection />
      <TrendingBlogs />
      {/* <LatestBlogs heading={"Latest Blogs"} blogs={filteredBlogs} /> */}
      <PopularAuthors />
    </article>
  </>


    
}