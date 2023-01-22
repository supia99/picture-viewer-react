import { useEffect, useState } from "react";
import { getFiles } from "../../api/getFiles";
import { File } from "../../model/File";
import { Picture } from "../picture/picture";

type props = {
  directory: string;
  setDirectory: React.Dispatch<React.SetStateAction<string>>;
};

export const Directories = ({ directory, setDirectory }: props) => {
  console.log(`Directories ${directory}`);
  const [files, setFiles] = useState([] as File[]);

  useEffect(() => {
    getFiles(directory, "-time").then((response) => {
      setFiles(response);
    });
    console.log("end useEffect");
  }, [directory]);

  const nestDirectory = (nestedDirectoryName: string, _e: any) => {
    console.log("nestDirectory:", nestedDirectoryName);
    if (directory === "/") {
      setDirectory(`/${nestedDirectoryName}`);
      return;
    }
    setDirectory(`${directory}/${nestedDirectoryName}`);
  };

  const nextDirectory = (nowDirectoryPath: string, _e: any) => {
    const oneHigherDirectory = getOneHigherDirectoryPath(nowDirectoryPath);
    const lastDirectoryName = nowDirectoryPath
      .replace(oneHigherDirectory, "")
      .replace("/", "");
    getFiles(oneHigherDirectory, "-time").then((responseFiles) => {
      setFiles(responseFiles);
      const fileNo = responseFiles.findIndex((file) => {
        return file.name === lastDirectoryName;
      });
      setDirectory(`${oneHigherDirectory}/${responseFiles[fileNo + 1].name}`);
    });
  };

  const prevDirectory = (nowDirectoryPath: string, _e: any) => {
    const oneHigherDirectory = getOneHigherDirectoryPath(nowDirectoryPath);
    const lastDirectoryName = nowDirectoryPath
      .replace(oneHigherDirectory, "")
      .replace("/", "");
    getFiles(oneHigherDirectory, "-time").then((responseFiles) => {
      setFiles(responseFiles);
      const fileNo = responseFiles.findIndex((file) => {
        return file.name === lastDirectoryName;
      });
      setDirectory(`${oneHigherDirectory}/${responseFiles[fileNo - 1].name}`);
    });
  };

  return files.length && isPicture(files) ? (
    <Picture
      directory={directory}
      files={files}
      nextDirectory={nextDirectory}
      prevDirectory={prevDirectory}
    />
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

const getOneHigherDirectoryPath = (directoryName: string) => {
  const directoryNameSplited = directoryName.split("/");
  let directoryNameCobined = "";
  directoryNameSplited
    .slice(1, directoryNameSplited.length - 1)
    .forEach((dName) => {
      directoryNameCobined = `${directoryNameCobined}/${dName}`;
    });

  return directoryNameCobined;
};
