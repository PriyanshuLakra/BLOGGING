import { useContext } from "react"
import { Context } from "../../main"

import { BeatLoader } from "react-spinners";
import { Link } from "react-router-dom";


export const HeroSection = () =>{

    const propDrill = useContext(Context);

    return <div>

        <section className="hero">

        {propDrill?.blog ? (
        propDrill?.blog.slice(0, 2).map((element) => {
          return (
            <Link to={`/blog/${element.id}`} className="card" key={element.id}>
              <img src={element.mainImage.url} alt="blog" className="blogImg" />
              <div className="category">{element.category}</div>
              <h1>{element.title}</h1>
              <div className="writer_section">
                <div className="author">
                  <img src={element.authorAvatar.authorAvatar.url} alt="author_avatar" />
                  <p>{element.authorName}</p>
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <BeatLoader color="gray" size={30} />
      )}

        </section>

    </div>
}