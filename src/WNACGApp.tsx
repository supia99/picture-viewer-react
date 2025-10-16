import { WNACG } from "./module/wnacg/wnacg";
import { useLocation } from "react-router-dom";

export default function WNACGApp() {
  const location = useLocation();
  
  return (
      <div className="app">
        <WNACG path={location.pathname} />
      </div>
  );
}