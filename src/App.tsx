import { Directories } from "./module/directories/directories";
import { Menu } from "./module/menu/menu";

function App() {
  
  return (
    <>
      <Menu/>
      <Directories directory={"/"}/>
    </>
  );
}

export default App;
