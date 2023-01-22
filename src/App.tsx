import { useState } from "react";
import { Directories } from "./module/directories/directories";
import { Menu } from "./module/menu/menu";

function App() {
  const [directory, sedDirectory] = useState("/");
  return (
    <>
      {/* <Menu /> */}
      <Directories directory={directory} setDirectory={sedDirectory} />
    </>
  );
}

export default App;
