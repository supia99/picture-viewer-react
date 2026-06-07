import { createContext, useEffect, useState } from "react";
import { Directories } from "./module/directories/directories";
import { Menu } from "./module/menu/menu";
import styles from "./PictureApp.module.css";
import { useLocation } from "react-router-dom";

export const SlideWaitTimeContext = createContext(3);
export default function PictureApp() {
  const [slideWaitTime, setSlideWaitTime] = useState(Number(localStorage.getItem("slideTimeSeconds")) || 3);
  const [isShowMenu, setIsShowMenu] = useState(true);

  const setSlideWaitTimeAndSetLocal = (second: number) => {
    setSlideWaitTime(second);
    localStorage.setItem("slideTimeSeconds", second.toString())
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();
      if (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (e.key === "m" || e.key === "M") {
        setIsShowMenu((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const path = useLocation().pathname;
  return (
    <SlideWaitTimeContext.Provider value={slideWaitTime}>
      <div className={styles.app}>
        <Menu
          setSlideWaitTime={setSlideWaitTimeAndSetLocal}
          isShowMenu={isShowMenu}
          setIsShowMenu={setIsShowMenu}
        />
        <Directories path={path.replace("/picture", "")} />
      </div>
    </SlideWaitTimeContext.Provider>
  );
}
