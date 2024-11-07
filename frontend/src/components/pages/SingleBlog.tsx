import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Context } from "../../main";

interface Iinterface{
    url:string,
    public_id:string
}
interface authorAvatarinterface{
    authorAvatar:Iinterface
}
interface BlogInterface{

    id:number ,
    title:string,
    mainImage:Iinterface,
    intro:string,
    mainContent:string,
    paraOneImage:Iinterface,
    paraOneDescription:string,
    paraOneTitle:string,
    paraTwoImage:Iinterface,
    paraTwoDescription:string,
    paraTwoTitle:string,
    paraThreeImage:Iinterface,
    paraThreeDescription:string,
    paraThreeTitle:string,
    category:string,
    createdById:number,
    authorName:string,
    authorAvatar:authorAvatarinterface,
    createdOn:Date


}

export const SingleBlog = ()=>{

    const {id} = useParams();

    const [blog , setBlog] = useState<BlogInterface>();

    useEffect(()=>{
        const getblog =async () =>{

            const {data} =await axios.get(`http://localhost:4000/api/v1/blog/getBlog/${id}`)

            setBlog(data.blog);


        }
        getblog();
    } ,[])



    const propDrill = useContext(Context)



    return (
        <article
      className={propDrill?.mode === "dark" ? "dark-bg singleBlog" : "light-bg singleBlog"}
    >
      {blog && (
        <section className="container">
          <div className="category">{blog.category}</div>
          <h1>{blog.title}</h1>
          <div className="writer_section">
            <div className="author">
              <img src={blog.authorAvatar.authorAvatar.url} alt="author_avatar" />
              <p>{blog.authorName}</p>
            </div>
          </div>
          {blog && blog.mainImage && (
            <img
              src={blog.mainImage.url}
              alt="mainBlogImg"
              className="mainImg"
            />
          )}
          <p className="intro-text">{blog.intro}</p>
          <div className="sub-para">
            <h3>{blog.paraOneTitle}</h3>
            {blog && blog.paraOneImage && (
              <img src={blog.paraOneImage.url} alt="paraOneImg" />
            )}
            <p>{blog.paraOneDescription}</p>
          </div>
          <div className="sub-para">
            <h3>{blog.paraTwoTitle}</h3>
            {blog && blog.paraTwoImage && (
              <img src={blog.paraTwoImage.url} alt="paraOneImg" />
            )}
            <p>{blog.paraThreeDescription}</p>
          </div>
          <div className="sub-para">
            <h3>{blog.paraThreeTitle}</h3>
            <p>{blog.paraThreeDescription}</p>
            {blog && blog.paraThreeImage && (
              <img src={blog.paraThreeImage.url} alt="paraOneImg" />
            )}
          </div>
        </section>
      )}
    </article>
    )
}