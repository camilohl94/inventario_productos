import { Outlet } from "react-router-dom";
import './App.css'
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header"

const App = () => {
  return (
    <div className="container">
      <Sidebar /> 
      <div className="main-content">
        <Header/>
        <Outlet /> 
      </div>
    </div>
  );
};

export default App;