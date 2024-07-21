import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteDirectory } from "../../api/deleteDirectory";
import { SlideWaitTimeContext } from "../../PictureApp";
import { File } from "../../model/File";
import "./picture.css";
import { PictureLink } from "../pictureComponent/link";
import { pictureNavigate } from "../pictureComponent/navigate";

type props = {
  directoryPath: string;
  files: File[];
  nextDirectoryPath: string;
  prevDirectoryPath: string;
  fileDomain: string;
};

export const Picture = ({
  directoryPath,
  files,
  nextDirectoryPath,
  prevDirectoryPath,
  fileDomain,
}: props) => {
  const [fileNo, set] = useState(0);
  const [isSlideShow, setIsSlideShow] = useState(false);
  const [imageStyle, setImageStyle] = useState({ background: "" });
  const [slideShowCount, setSlideShowCount] = useState(0);
  const [firstOrlastPage, setFirstOrlastPage] = useState(
    "first" as "first" | "last"
  );
  const slideShowWaitTime = useContext(SlideWaitTimeContext);
  const navigate = useNavigate();
  const setFileNo = (no: number) => {
    set(no);
    setImageStyle({
      background: `center / contain no-repeat url("http://${fileDomain}${directoryPath}/${files[fileNo].name}")`,
    });
  };
  const pictureModuleRef = useRef(null);

  useEffect(() => {
    // TODO: anyを解決する
    (pictureModuleRef.current! as any).focus();
    setImageStyle({
      background: `center / contain no-repeat url("http://${fileDomain}${directoryPath}/${files[fileNo].name}")`,
    });
  }, [fileNo]);

  useEffect(() => {
    slideShow();
  }, [slideShowCount]);

  const slideShow = () => {
    if (isSlideShow) {
      const waitTime = slideShowWaitTime * 1000;
      nextFile();
      window.setTimeout(() => {
        setSlideShowCount(slideShowCount + 1);
      }, waitTime);
    }
  };

  // ディレクトリ移動をしたときに移動した後のページ数を使用する
  useEffect(() => {
    console.log(
      `useEffect(,[directoryPath]) firstOrlastPage ${firstOrlastPage} files.length: ${
        files.length
      } path: ${decodeURI(directoryPath)} prevPath: ${decodeURI(
        prevDirectoryPath
      )} nextPath: ${decodeURI(nextDirectoryPath)}, page:${
        firstOrlastPage === "first" ? 0 : files.length - 1
      }`
    );
    setFileNo(firstOrlastPage === "first" ? 0 : files.length - 1);
  }, [files]);

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
    // 次ディレクトリ初回表示時に最大ページ数より大きいとエラーになるため0にする
    setFileNo(0);
    pictureNavigate(navigate, nextDirectoryPath);
  };
  const prevDirectory = () => {
    setFirstOrlastPage("last");
    pictureNavigate(navigate, prevDirectoryPath);
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
    const waitTime = slideShowWaitTime * 1000;
    window.setTimeout(() => {
      setSlideShowCount(slideShowCount + 1);
    }, waitTime);
  };

  const deleteAction = () => {
    // TODO: 削除時に次のディレクトリに移動させることに失敗している
    setFirstOrlastPage("first");
    pictureNavigate(navigate, nextDirectoryPath);
    deleteDirectory(directoryPath);
  };

  // 確認ダイアログで確認をした上でactionを実行する
  const confirmAction = (action: () => void, navigationMessage: string) => {
    const confirm = window.confirm(navigationMessage);
    confirm && action();
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
        deleteAction();
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
        {fileNo === 0 ? (
          <PictureLink
            className="prevArea"
            to={prevDirectoryPath}
            onClick={() => setFirstOrlastPage("last")}
          ></PictureLink>
        ) : (
          <div className="prevArea" onClick={() => prevFile()}></div>
        )}
        <div className="directoryArea">
          <PictureLink
            className="prevDirectoryArea"
            to={prevDirectoryPath}
            onClick={() => {
              setFirstOrlastPage("last");
            }}
          ></PictureLink>
          <div className="middleArea" onClick={onOffSlideShow}></div>
          <PictureLink
            className="nextDirectoryArea"
            to={nextDirectoryPath}
            onClick={() => {
              setFirstOrlastPage("first");
            }}
          ></PictureLink>
        </div>
        {fileNo === files.length - 1 ? (
          <PictureLink
            className="nextArea"
            to={nextDirectoryPath}
            onClick={() => {
              setFirstOrlastPage("first");
            }}
          ></PictureLink>
        ) : (
          <div className="nextArea" onClick={() => nextFile()}></div>
        )}
        <img
          src="/delete.svg"
          className="delete"
          onClick={() => {
            confirmAction(deleteAction, `以下を削除しますか？\n${decodeURI(directoryPath)}`);
          }}
        ></img>
      </div>
      {files.map((file) => (
        <img
          className="only-reading"
          src={`http://${fileDomain}${directoryPath}/${file.name}`}
        />
      ))}
    </div>
  );
};
