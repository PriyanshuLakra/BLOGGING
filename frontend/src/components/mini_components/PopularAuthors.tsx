import axios from "axios";
import { useEffect, useState } from "react"
import { BeatLoader } from "react-spinners";


interface AvatarImage {
    url: string;
    public_id: string;
  }
  
interface Avtar {
    id: number;
    name: string;
    phone: string;
    email: string;
    avatar: AvatarImage;
    education: string;
    role: String; // Use specific roles if they are predefined
    password: string;
    createdOn: string; // Or Date if you parse it into a Date object
  }
  

export const PopularAuthors = () =>{

    const [authors , setAuthors] = useState<Avtar[]>([]);


    useEffect(()=>{

        const fetchAuthors = async ()=>{

            const {data} = await axios.get("http://localhost:4000/api/v1/user/getAllAuthor");
            setAuthors(data.authors);
        }
        fetchAuthors();
    } , [])
    return (
        <section className="popularAuthors">
      <h3>Popular Authors</h3>
      <div className="container">
        {authors && authors.length > 0 ? (
          authors.slice(0, 4).map((element) => {
            return (
              <div className="card" key={element.id}>
                <img src={element.avatar.url} alt="author" />
                <p>{element.name}</p>
                <p>{element.role}</p>
              </div>
            );
          })
        ) : (
          <BeatLoader color="gray" size={30} />
        )}
      </div>
    </section>
    )


        
   
}