import { useEffect, useState } from "react";
import { getFiles } from "../../api/getFiles";
import { File } from "../../model/File";
import { Picture } from "../picture/picture";

type props = {
  directory: string;
};

export const Directories = (props: props) => {
  const [files, setFiles] = useState([] as File[]);
  const [directory, setDirectory] = useState(props.directory);
  useEffect(() => {
    getFiles(directory, "-time").then((response) => {
      setFiles(response);
    });
    console.log("end useEffect");
  }, [directory]);

  const nestDirectory = (nestedDirectoryName: string, _e: any) => {
    console.log("nestDirectory:", nestedDirectoryName);
    setDirectory(`${directory}/${nestedDirectoryName}`);
  };

  return files.length && isPicture(files) ? (
    <Picture directory={directory} files={files} />
  ) : (
    <>
      <ul>
        {files.map((file) => {
          return (
            <li key={file.name} onClick={(e) => nestDirectory(file.name, e)}>
              {file.name}
            </li>
          );
        })}
      </ul>
    </>
  );
};

const isPicture = (files: File[]): boolean => {
  if (files.length === 0) {
    return false;
  }
  const pictureFileExtensions = ["jpeg", "jpg", "png"];
  return (
    pictureFileExtensions.filter((pictureFileExtension) =>
      files[0].name.includes(pictureFileExtension)
    ).length > 0
  );
};
