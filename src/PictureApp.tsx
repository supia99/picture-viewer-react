import { createContext, useEffect, useState } from "react";
import { Directories } from "./module/directories/directories";
import { Menu } from "./module/menu/menu";
import styles from "./PictureApp.module.css";
import { useLocation } from "react-router-dom";

export const SlideWaitTimeContext = createContext(3);

function getDisplayUrlPart() {
  const decodedUrlParts = decodeURIComponent(window.location.href).split("/").filter(Boolean);
  const folderName = decodedUrlParts[decodedUrlParts.length - 1] ?? "";
  if(!folderName) return {author: "", authorGroup: "", title: folderName};
  const devidedFolderName = folderName.split("_").filter(Boolean);
  if (devidedFolderName.length !== 2) return {author: "", authorGroup: "", title: folderName};
  const [author, title] = devidedFolderName;
  const groupMatch = author.match(/^(.*)（(.*)）$/);
  return groupMatch
    ? {author: groupMatch[1], authorGroup: groupMatch[2], title}
    : {author, authorGroup: "", title};
}

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
  const { author, authorGroup, title } = getDisplayUrlPart();
  const [copiedPart, setCopiedPart] = useState<"author" | "authorGroup" | "title" | null>(null);
  const copyToClipboard = (text: string, part: "author" | "authorGroup" | "title") => {
    navigator.clipboard.writeText(text.replace(/　/g, ""));
    setCopiedPart(part);
    setTimeout(() => setCopiedPart(null), 1000);
  };
  return (
    <SlideWaitTimeContext.Provider value={slideWaitTime}>
      <div className={styles.app}>
        <div className={styles.urlDisplay}>
          <span
            className={`${styles.urlPart} ${copiedPart === "author" ? styles.urlPartCopied : ""}`}
            onClick={() => copyToClipboard(author, "author")}
          >
            {author}
          </span>
          {authorGroup ? (
            <>
              {" （"}
              <span
                className={`${styles.urlPart} ${copiedPart === "authorGroup" ? styles.urlPartCopied : ""}`}
                onClick={() => copyToClipboard(authorGroup, "authorGroup")}
              >
                {authorGroup}
              </span>
              {"）"}
            </>
          ) : null}
          {author && title ? " - " : ""}
          <span
            className={`${styles.urlPart} ${copiedPart === "title" ? styles.urlPartCopied : ""}`}
            onClick={() => copyToClipboard(title, "title")}
          >
            {title}
          </span>
        </div>
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
