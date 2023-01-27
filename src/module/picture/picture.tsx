import { useEffect, useRef, useState } from "react";
import { File } from "../../model/File";
import "./picture.css";

type props = {
  directory: string;
  files: File[];
  nextDirectory: (arg0: string, arg1: any) => void;
  prevDirectory: (arg0: string, arg1: any) => void;
  firstOrLast: "first" | "last";
};

export const Picture = ({
  directory,
  files,
  nextDirectory,
  prevDirectory,
  firstOrLast,
}: props) => {
  const [fileNo, setFileNo] = useState(0);
  const [isSlideShow, setIsSlideShow] = useState(false);
  const pictureModuleRef = useRef(null);
  useEffect(() => {
    const waitTime = 1 * 1000;
    if (isSlideShow) {
      window.setTimeout(() => {
        nextFile();
      }, waitTime);
    }
    //TODO: 表示時に選択状態にしないと、キーボード操作が聞かなかったような気がする
    (pictureModuleRef.current! as any).focus();
  }, [fileNo]);
  useEffect(() => {
    setFileNo(firstOrLast === "first" ? 0 : files.length - 1);
  }, []);

  const src = `${import.meta.env.VITE_FILE_BASE_URL}/sdb${directory}/${
    files[fileNo].name
  }`;

  const nextFile = () => {
    setFileNo(fileNo + 1);
  };
  const prevFile = () => {
    setFileNo(fileNo - 1);
  };

  const onOffSlideShow = () => {
    console.log("run slideShow");
    if (isSlideShow) {
      setIsSlideShow(false);
      console.log("slideShow off");
      return;
    }
    console.log("slideShow on");
    setIsSlideShow(true);
    nextFile();
  };

  // TODO: anyを解決する
  const keyOperation = (e: any) => {
    switch (e.key) {
      case "ArrowLeft":
        fileNo === 0 ? prevDirectory(directory, e) : prevFile();
        break;
      case "ArrowRight":
        fileNo === files.length - 1 ? nextDirectory(directory, e) : nextFile();
        break;
      case "ArrowUp":
        prevDirectory(directory, e);
        break;
      case "ArrowDown":
        nextDirectory(directory, e);
        break;
    }
  };

  return (
    <div onKeyDown={(e) => keyOperation(e)} tabIndex={0} ref={pictureModuleRef}>
      <div className="pictureCover">
        <img src={src} className="picture" />
      </div>
      <div className="navigateArea">
        <div
          className="prevArea"
          onClick={(e) =>
            fileNo === 0 ? prevDirectory(directory, e) : prevFile()
          }
        ></div>
        <div className="directoryArea">
          <div
            className="prevDirectoryArea"
            onClick={(e) => prevDirectory(directory, e)}
          ></div>
          <div className="middleArea" onClick={onOffSlideShow}></div>
          <div
            className="nextDirectoryArea"
            id="nextDirectoryArea"
            onClick={(e) => nextDirectory(directory, e)}
          ></div>
        </div>
        <div
          className="nextArea"
          onClick={(e) =>
            fileNo === files.length - 1
              ? nextDirectory(directory, e)
              : nextFile()
          }
        ></div>
      </div>
    </div>
  );
};
