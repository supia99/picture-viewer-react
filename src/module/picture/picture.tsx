import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteDirectory } from "../../api/deleteDirectory";
import { SlideWaitTimeContext } from "../../App";
import { File } from "../../model/File";
import "./picture.css";

type props = {
  directoryPath: string;
  files: File[];
  nextDirectoryPath: string;
  prevDirectoryPath: string;
};

export const Picture = ({
  directoryPath,
  files,
  nextDirectoryPath,
  prevDirectoryPath,
}: props) => {
  const [fileNo, set] = useState(0);
  const [isSlideShow, setIsSlideShow] = useState(false);
  const [imageStyle, setImageStyle] = useState({ background: "" });
  const [firstOrlastPage, setFirstOrlastPage] = useState(
    "first" as "first" | "last"
  );
  const slideShowWaitTime = useContext(SlideWaitTimeContext);
  const navigate = useNavigate();
  const setFileNo = (no: number) => {
    set(no);
    setImageStyle({
      background: `center / contain no-repeat url("${
        import.meta.env.VITE_FILE_BASE_URL
      }/sdb${directoryPath}/${files[fileNo].name}")`,
    });
  };
  const pictureModuleRef = useRef(null);

  useEffect(() => {
    if (isSlideShow) {
      const waitTime = slideShowWaitTime * 1000;
      const tmpFileNo = fileNo;
      window.setTimeout(() => {
        console.log(`slideShow tmpFileNo: ${tmpFileNo} fileNo: ${fileNo}`);
        tmpFileNo === fileNo && nextFile();
      }, waitTime);
    }
    // TODO: anyを解決する
    (pictureModuleRef.current! as any).focus();
    setImageStyle({
      background: `center / contain no-repeat url("${
        import.meta.env.VITE_FILE_BASE_URL
      }/sdb${directoryPath}/${files[fileNo].name}")`,
    });
  }, [fileNo]);

  useEffect(() => {
    console.log(`firstOrlastPage ${firstOrlastPage}`);
    setFileNo(firstOrlastPage === "first" ? 0 : files.length - 1);
  }, [directoryPath]);

  const nextFile = () => {
    if (fileNo === files.length - 1) {
      nextDirectory();
    } else {
      setFileNo(fileNo + 1);
    }
  };
  const prevFile = () => {
    if (fileNo === 0) {
      prevDirectory();
    } else {
      setFileNo(fileNo - 1);
    }
  };
  const nextDirectory = () => {
    setFirstOrlastPage("first");
    navigate(nextDirectoryPath);
  };
  const prevDirectory = () => {
    setFirstOrlastPage("last");
    navigate(prevDirectoryPath);
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
        prevFile();
        break;
      case "ArrowRight":
        nextFile();
        break;
      case "ArrowUp":
        prevDirectory();
        break;
      case "ArrowDown":
        nextDirectory();
        break;
      case "a":
        onOffSlideShow();
        break;
      case "Delete":
        // TODO: 削除時に次のディレクトリに移動させることに失敗している
        setFirstOrlastPage("first");
        navigate(nextDirectoryPath);
        deleteDirectory(directoryPath);
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
      <div className="navigateArea" style={imageStyle}>
        {/* TODO: Linkは不要 */}
        {fileNo === 0 ? (
          <Link
            className="prevArea"
            to={prevDirectoryPath}
            onClick={() => setFirstOrlastPage("last")}
          ></Link>
        ) : (
          <div className="prevArea" onClick={() => prevFile()}></div>
        )}
        <div className="directoryArea">
          <Link
            className="prevDirectoryArea"
            to={prevDirectoryPath}
            onClick={() => {
              setFirstOrlastPage("last");
            }}
          ></Link>
          <div className="middleArea" onClick={onOffSlideShow}></div>
          <Link
            className="nextDirectoryArea"
            to={nextDirectoryPath}
            onClick={() => {
              setFirstOrlastPage("first");
            }}
          ></Link>
        </div>
        {fileNo === files.length - 1 ? (
          <Link
            className="nextArea"
            to={nextDirectoryPath}
            onClick={() => {
              setFirstOrlastPage("first");
            }}
          ></Link>
        ) : (
          <div className="nextArea" onClick={() => nextFile()}></div>
        )}
      </div>
    </div>
  );
};
