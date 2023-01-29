import { useContext, useEffect, useRef, useState } from "react";
import { deleteDirectory } from "../../api/deleteDirectory";
import { SlideWaitTimeContext } from "../../App";
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
  const [fileNo, set] = useState(
    firstOrLast === "first" ? 0 : files.length - 1
  );
  const [isSlideShow, setIsSlideShow] = useState(false);
  const [imageStyle, setImageStyle] = useState({ background: "" });
  const slideShowWaitTime = useContext(SlideWaitTimeContext);
  const setFileNo = (no: number) => {
    set(no);
    setImageStyle({
      background: `center / contain no-repeat url("${
        import.meta.env.VITE_FILE_BASE_URL
      }/sdb${directory}/${files[fileNo].name}")`,
    });
  };
  const pictureModuleRef = useRef(null);
  const src = `${import.meta.env.VITE_FILE_BASE_URL}/sdb${directory}/${
    files[fileNo].name
  }`;
  console.log(`src: ${src}`);

  useEffect(() => {
    //TODO: SlideWaitTimeContextを取得しようとするとエラーになる
    // fileNoを書き換えるたびにuseEffectが呼ばれる想定だったが、そうではない？
    if (isSlideShow) {
      const waitTime = slideShowWaitTime * 1000;
      window.setTimeout(() => {
        nextFile();
      }, waitTime);
    }
    // TODO: anyを解決する
    (pictureModuleRef.current! as any).focus();
  }, [fileNo]);
  useEffect(() => {
    setFileNo(firstOrLast === "first" ? 0 : files.length - 1);
  }, []);

  const nextFile = () => {
    setFileNo(fileNo + 1);
  };
  const prevFile = () => {
    setFileNo(fileNo - 1);
  };

  //TODO: slideShowモードで起動時にnextFile(), prevFile()を実行するとバグるのを解決する
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
    console.log(`e.key: ${e.key}`);
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
      case "a":
        onOffSlideShow();
        break;
      case "Delete":
        // TODO: 削除時に次のディレクトリに移動させることに失敗している
        nextDirectory(directory, e);
        deleteDirectory(directory);
        break;
    }
  };

  return (
    <div
      className="pictureModule"
      onKeyDown={(e) => keyOperation(e)}
      tabIndex={0}
      ref={pictureModuleRef}
    >
      <img src={src} className="fullPicture" />
      <div className="navigateArea" style={imageStyle}>
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
