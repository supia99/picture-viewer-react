import { createContext, useState } from "react";
import { Directories } from "./module/directories/directories";
import { Menu } from "./module/menu/menu";
import "./PictureApp.css";
import { useLocation } from "react-router-dom";

export const SlideWaitTimeContext = createContext(3);
export default function PictureApp() {
  const [slideWaitTime, setSlideWaitTime] = useState(Number(localStorage.getItem("slideTimeSeconds")) || 3);
  const setSlideWaitTimeAndSetLocal = (second: number) => {
    setSlideWaitTime(second);
    localStorage.setItem("slideTimeSeconds", second.toString())
  }
  const path = useLocation().pathname;
  return (
    <SlideWaitTimeContext.Provider value={slideWaitTime}>
      <div className="app">
        <Menu setSlideWaitTime={setSlideWaitTimeAndSetLocal} />
        <Directories path={path.replace("/picture", "")} />
      </div>
    </SlideWaitTimeContext.Provider>
  );
}
