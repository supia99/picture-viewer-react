import { BrowserRouter, Link, Route } from "react-router-dom";
import { Directories } from "./module/directories/directories";
import { Pictures } from "./module/picture/pictures";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Link to="/">Home</Link>
        <Link to="/page1">Page1</Link>
      </div>
      <switch>
        <Route path="/">
          <div>home</div>
        </Route>
        <Route path="/picture">
          <Pictures />
        </Route>
      </switch>
    </BrowserRouter>
  );
}

export default App;
