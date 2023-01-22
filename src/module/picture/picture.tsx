import { useState } from "react";
import { File } from "../../model/File";
import "./picture.css";

type props = {
  directory: string;
  files: File[];
};

export const Picture = ({ directory, files }: props) => {
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
  const nextDirectory = () => {};
  const prevDirectory = () => {};

  return (
    <>
      <img src={src} className="picture" />
      <div className="navigateArea">
        <div className="prevArea" onClick={prevFile}></div>
        <div className="directoryArea">
          <div className="prevDirectoryArea"></div>
          <div className="middleArea"></div>
          <div className="nextDirectoryArea"></div>
        </div>
        <div className="nextArea" onClick={nextFile}></div>
      </div>
    </>
  );
};
