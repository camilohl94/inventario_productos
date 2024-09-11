import Sidebar from "./Sidebar";
import Contenido from "./Contenido";
import { useState } from "react";

const App =()=>{
    const [activeSection, setActiveSection] = useState("Dashboard");
    return(
    <div className="container">
      <Sidebar onSectionChange={setActiveSection} />
      <Contenido activeSection={activeSection} />
    </div>
    )
}

export default App