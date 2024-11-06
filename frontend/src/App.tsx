
import "./App.css";

import {BrowserRouter, Route,  Routes} from "react-router-dom"

import { Dashboard } from "./components/pages/Dashboard"

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard></Dashboard>}></Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
