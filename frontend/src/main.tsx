import { createContext, StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'


interface User{
        id: Number,
        name: String,
        phone:String,
        email:String,
        avatar: String,
        education: String,
        role: String,
        password:String,
        createdOn:Date
}

interface Image {
  url: string;
  public_id: string;
}

interface AuthorAvatar {
  url: string;
  public_id: string;
}

interface Blog {
  id: number;
  title: string;
  mainImage: Image;
  intro: string;
  mainContent: string;
  paraOneImage: Image | null;
  paraOneDescription: string | null;
  paraOneTitle: string | null;
  paraTwoImage: Image | null;
  paraTwoDescription: string | null;
  paraTwoTitle: string | null;
  paraThreeImage: Image | null;
  paraThreeDescription: string | null;
  paraThreeTitle: string | null;
  category: string;
  createdById: number;
  authorName: string;
  authorAvatar: {
      authorAvatar: AuthorAvatar;
  };
  createdOn: string; // Use `Date` if you plan to convert this to a Date object
}


type contexttype = {

  isAuthenticated:boolean,
  setIsAuthenticated:(value:boolean)=>void,
  user:User,
  setUser:(user:User)=>void,
  blog:Blog[],
  setBlog:(blog:Blog[])=>void,
  mode:string,
  setMode:(mode:string)=>void

}


export const Context = createContext<contexttype | undefined>(undefined);
 



const AppWrapper = () =>{
  const currDate: Date = new Date();
  const [isAuthenticated , setIsAuthenticated] = useState(false);

  const [user , setUser] = useState<User>({id:-1 , name:"" , phone:"" , email:"",avatar:"" , education:"" ,role:"",password:"" ,createdOn:currDate});

  // const [blog , setBlog] = useState<Blog | null>(null);
  const [blog, setBlog] = useState<Blog[]>([])


  const [mode , setMode ] = useState("dark");

  return (
    <Context.Provider  value={{isAuthenticated , setIsAuthenticated , user , setUser, blog , setBlog ,mode , setMode }}>
      <App></App>
    </Context.Provider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWrapper></AppWrapper>
  </StrictMode>,
)
