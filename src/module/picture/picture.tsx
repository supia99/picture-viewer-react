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

//TODO: 前のディレクトリに戻ったときに前のディレクトリでの最後のページにする
// 現状は、今のディレクトリの最後のページになっている気がする
export const Picture = ({
  directoryPath,
  files,
  nextDirectoryPath,
  prevDirectoryPath,
  fileDomain,
}: props) => {
  // const [fileNo, setFileNo] = useState(0);
  const [isSlideShow, setIsSlideShow] = useState(false);
  // const [imageStyle, setImageStyle] = useState({ background: "" });
  const [slideShowCount, setSlideShowCount] = useState(0);
  const [firstOrlastPage, setFirstOrlastPage] = useState(
    "first" as "first" | "last"
  );
  const slideShowWaitTime = useContext(SlideWaitTimeContext);
  const navigate = useNavigate();
  useEffect(() => {
    slideShow();
  }, [slideShowCount]);

  const slideShow = () => {
    if (isSlideShow) {
      const waitTime = slideShowWaitTime * 1000;
      // TODO: 次のanchorに移動する
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
  }, [files]);

  const nextDirectory = () => {
    setFirstOrlastPage("first");
    pictureNavigate(navigate, nextDirectoryPath);
  };
  const prevDirectory = () => {
    setFirstOrlastPage("last");
    pictureNavigate(navigate, prevDirectoryPath);
  };
  // const nextFile = () => {
  //   const anchors = location.href.match(/#.+/);
  //   if (anchors) {
  //     let i = 0;
  //     const anchor = anchors[0].replace("#", "");
  //     while (files[i].name.replace(".", "_") !== anchor) {
  //       i++;
  //     }
  //     if (i + 1 > files.length) {
  //       nextDirectory();
  //       return;
  //     }
  //     pictureNavigate(navigate, directoryPath+"#"+files[i + 1].name.replace(".", "_"));
  //   } else {
  //     if (files.length > 2) {
  //       pictureNavigate(navigate, directoryPath+"#"+files[2].name.replace(".", "_"));
  //       return;
  //     }
  //     nextDirectory();
  //   }
  // };
  // const prevFile = () => {
  //   const anchors = location.href.match(/#.+/);
  //   if (anchors) {
  //     let i = 0;
  //     const anchor = anchors[0].replace("#", "");
  //     while (files[i].name.replace(".", "_") !== anchor) {
  //       i++;
  //     }
  //     if (i !== 0) {
  //       pictureNavigate(navigate, directoryPath+"#"+files[i-1].name.replace(".", "_"))
  //       return;
  //     }
  //   } 
  //   prevDirectory();
  // };

  const onOffSlideShow = () => {
    console.log("run slideShow");
    if (isSlideShow) {
      setIsSlideShow(false);
      console.log("slideShow off");
      return;
    }
    console.log("slideShow on");
    setIsSlideShow(true);
    // TODO: 次のアンカーに移動する
    const waitTime = slideShowWaitTime * 1000;
    window.setTimeout(() => {
      setSlideShowCount(slideShowCount + 1);
    }, waitTime);
  };

  // TODO: anyを解決する
  const keyOperation = (e: any) => {
    console.log(`e.key: ${e.key}`);
    switch (e.key) {
      case "ArrowLeft":
        // prevFile();
        break;
      case "ArrowRight":
        // nextFile();
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
        pictureNavigate(navigate, nextDirectoryPath);
        deleteDirectory(directoryPath);
        break;
    }
  };

  return (
    <div className="pictureModule" onKeyDown={(e) => keyOperation(e)}>
      {files.map((file, i) => {
        return (
          <div
            className="navigateArea"
            style={createImageStyle(
              `http://${fileDomain}${directoryPath}/${file.name}`
            )}
            tabIndex={i}
            id={`${file.name.replace(".", "_")}`}
            key={`${file.name}`}
          >
            {i === 0 ? (
              <PictureLink
                className="prevArea"
                to={prevDirectoryPath}
                onClick={() => setFirstOrlastPage("last")}
              ></PictureLink>
            ) : (
              <a
                className="prevArea"
                href={changeHrefAnchor(`${files[i - 1].name.replace(".", "_")}`)}
              ></a>
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
            {i === files.length - 1 ? (
              <PictureLink
                className="nextArea"
                to={nextDirectoryPath}
                onClick={() => {
                  setFirstOrlastPage("first");
                }}
              ></PictureLink>
            ) : (
              <a
                className="nextArea"
                href={changeHrefAnchor(`${files[i + 1].name.replace(".", "_")}`)}
              ></a>
            )}
          </div>
        );
      })}
    </div>
  );
};

const createImageStyle = (fileUrl: string) => {
  const css = {
    background: `url(\"${fileUrl}\") center center / contain no-repeat`,
  };
  console.log(`createImageStyle:${JSON.stringify(css)}`);
  return css;
};

const changeHrefAnchor = (anchorName: string) => {
  const nowUrl = location.href.replace(/#.+/, "");
  return `${nowUrl}#${anchorName}`;
};
