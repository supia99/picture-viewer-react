import { createContext, useState } from "react";
import { Directories } from "./module/directories/directories";
import { Menu } from "./module/menu/menu";
import "./App.css";
import { useLocation } from "react-router-dom";

export const SlideWaitTimeContext = createContext(3);
function App() {
  const [slideWaitTime, setSlideWaitTime] = useState(3);
  const path = useLocation().pathname;
  console.log(`path:${path}`);
  return (
    <SlideWaitTimeContext.Provider value={slideWaitTime}>
      <div className="app">
        <Menu setSlideWaitTime={setSlideWaitTime} />
        <Directories path={path} />
      </div>
    </SlideWaitTimeContext.Provider>
  );
}

export default App;
