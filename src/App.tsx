import { createContext, useState } from "react";
import { Directories } from "./module/directories/directories";
import { Menu } from "./module/menu/menu";

export const SlideWaitTimeContext = createContext(3);
function App() {
  const [directory, sedDirectory] = useState("/");
  const [slideWaitTime, setSlideWaitTime] = useState(3);
  return (
    <SlideWaitTimeContext.Provider value={slideWaitTime}>
      <Menu setSlideWaitTime={setSlideWaitTime} />
      <Directories directory={directory} setDirectory={sedDirectory} />
    </SlideWaitTimeContext.Provider>
  );
}

export default App;
