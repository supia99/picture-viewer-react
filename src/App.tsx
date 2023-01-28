import { createContext, useState } from "react";
import { Directories } from "./module/directories/directories";
import { Menu } from "./module/menu/menu";
import "./App.css";

export const SlideWaitTimeContext = createContext(3);
function App() {
  const [directory, sedDirectory] = useState("/");
  const [slideWaitTime, setSlideWaitTime] = useState(3);
  return (
    <SlideWaitTimeContext.Provider value={slideWaitTime}>
      <div className="app">
        <Menu setSlideWaitTime={setSlideWaitTime} />
        <Directories directory={directory} setDirectory={sedDirectory} />
      </div>
    </SlideWaitTimeContext.Provider>
  );
}

export default App;
