import { useState } from "react";
import { File } from "../../model/File";
import "./picture.css";

type props = {
  directory: string;
  files: File[];
  nextDirectory: (arg0: string, arg1: any) => void;
  prevDirectory: (arg0: string, arg1: any) => void;
};

export const Picture = ({
  directory,
  files,
  nextDirectory,
  prevDirectory,
}: props) => {
  const [fileNo, setFileNo] = useState(0);
  const src = `${import.meta.env.VITE_FILE_BASE_URL}/hTufNas${directory}/${
    files[fileNo].name
  }`;

  const nextFile = () => {
    setFileNo(fileNo + 1);
  };
  const prevFile = () => {
    setFileNo(fileNo - 1);
  };

  return (
    <>
      <div className="pictureCover">
        <img src={src} className="picture" />
      </div>
      <div className="navigateArea">
        <div className="prevArea" onClick={prevFile}></div>
        <div className="directoryArea">
          <div
            className="prevDirectoryArea"
            onClick={(e) => prevDirectory(directory, e)}
          ></div>
          <div className="middleArea"></div>
          <div
            className="nextDirectoryArea"
            onClick={(e) => nextDirectory(directory, e)}
          ></div>
        </div>
        <div className="nextArea" onClick={nextFile}></div>
      </div>
    </>
  );
};
