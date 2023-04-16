import { useLocation } from "react-router-dom";
import { Wnacg } from "./wnacg";

export default function WnacgApp() {
  const path = useLocation().pathname;
  // console.log(`path:${path}`);
  return (
      <div className="app">
        <Wnacg path={path.replace("/wnacg", "")}/>
      </div>
  );
}

