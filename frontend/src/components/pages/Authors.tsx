import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { Context } from "../../main";
import { BeatLoader } from "react-spinners";

interface AvatarImage{
    url:string,
    public_id:string
}

interface AuthorsInterface{

    id:number,
    name:string,
    phone:string,
    email:string,
    avatar:AvatarImage,
    education:string,
    role:string ,
    password:string,
    createdOn:Date

}
export const Authors = () =>{

    const [authors , setAuthors] = useState<AuthorsInterface[] | null>(null);


    useEffect(()=>{

        const getAllauthors = async () =>{

            const {data} = await axios.get("http://localhost:4000/api/v1/user/getAllAuthor");
            setAuthors(data.authors);

        }

        getAllauthors();
    } , [])


    const propDrill = useContext(Context)
    

    return (
        <article
      className={
        propDrill?.mode === "dark" ? "dark-bg all-authors" : "light-bg all-authors"
      }
    >
      <h2>ALL AUTHORS</h2>
      <div className="container">
        {authors && authors.length > 0 ? (
          authors.map((element) => {
            return (
              <div className="card" key={element.id}>
                {/* {authors && authors.avatar && ( */}
                  <img src={element.avatar.url} alt="author_avatar" />
                {/* )} */}
                <h3>{element.name}</h3>
                <p>{element.role}</p>
              </div>
            );
          })
        ) : (
          <BeatLoader color="gray" size={50} style={{ padding: "200px 0" }} />
        )}
      </div>
    </article>
    )
}