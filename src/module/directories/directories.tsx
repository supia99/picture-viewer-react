import { useEffect, useState } from "react";
import { getFiles } from "../../api/getFiles";
import { File } from "../../model/File";
import { Picture } from "../picture/picture";
import { PictureLink } from "../pictureComponent/link";
import { getSortBy } from "../menu/menu";

type props = {
  path: string;
};

export const Directories = ({ path }: props) => {
  const [files, setFiles] = useState([] as File[]);
  const [nextDirectoryPath, setNextDirectoryPath] = useState("/");
  const [prevDirectoryPath, setPrevDirectoryPath] = useState("/");
  const [fileDomain, setFileDomain] = useState("");

  useEffect(() => {
    const sortBy = getSortBy() || "-time"
    getFiles(path || "/", sortBy).then((response) => {
      setFiles(response.children);
      setFileDomain(response.fileDomain);
    });

    if (path !== "/") {
      const oneHigherDirectoryPath = getOneHigherDirectoryPath(path);
      const lastDirectoryName = decodeURI(
        path.replace(oneHigherDirectoryPath, "").replace("/", "")
      );
      getFiles(oneHigherDirectoryPath, sortBy).then((responseDirectory) => {
        const fileNo = responseDirectory.children.findIndex((directory) => {
          return directory.name === lastDirectoryName;
        });
        setNextDirectoryPath(
          `${oneHigherDirectoryPath}/${
            responseDirectory.children[fileNo + 1].name
          }`
        );
        setPrevDirectoryPath(
          `${oneHigherDirectoryPath}/${
            responseDirectory.children[fileNo - 1].name
          }`
        );
      });
    }

    console.log("end useEffect");
  }, [path]);

  console.log("directoryes rendering");
  return files.length && isPicture(files) ? (
    <Picture
      directoryPath={path}
      files={files}
      nextDirectoryPath={nextDirectoryPath}
      prevDirectoryPath={prevDirectoryPath}
      fileDomain={fileDomain}
    />
  ) : (
    <>
      <ul>
        {path && <LiLinkReturn path={path} />}
        {files.map((file) => {
          return (
            <li key={file.name}>
              <PictureLink
                to={path === "/" ? `${file.name}` : `${path}/${file.name}`}
              >
                {file.name}
              </PictureLink>
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
  // TODO: string.lastIndexOfを使うようにする
  const directoryNameSplited = directoryName.split("/");
  let directoryNameCobined = "";
  directoryNameSplited
    .slice(1, directoryNameSplited.length - 1)
    .forEach((dName) => {
      directoryNameCobined = `${directoryNameCobined}/${dName}`;
    });

  return directoryNameCobined;
};

const LiLinkReturn = ({ path }: { path: string }) => {
  if (!path || path === "/") {
    return <></>;
  }

  return (
    <li>
      {path.includes("/") ? (
        <PictureLink to={path.substring(0, path.lastIndexOf("/"))}>..</PictureLink>
      ) : (
        <PictureLink to="/">..</PictureLink>
      )}
    </li>
  );
};
