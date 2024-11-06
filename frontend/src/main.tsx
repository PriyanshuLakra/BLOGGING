import { createContext, StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'


interface User{
  role:string,
}


type contexttype = {

  isAuthenticated:boolean,
  setIsAuthenticated:(value:boolean)=>void,
  user:User,
  setUser:(user:User)=>void,
  blog:object[],
  setBlog:(blog:object[])=>void,
  mode:string,
  setMode:(mode:string)=>void

}


export const Context = createContext<contexttype | undefined>(undefined);
 


const AppWrapper = () =>{

  const [isAuthenticated , setIsAuthenticated] = useState(false);

  const [user , setUser] = useState<User>({role:""});

  const [blog , setBlog] = useState<object[]>([]);

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
