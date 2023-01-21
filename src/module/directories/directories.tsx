import { useEffect, useState } from "react";
import { getFiles } from "../../api/getFiles";

type File = {
  name: string,
  time: number
}

type props = {
  directory: string
}

export const Directories = (props: props) => {
  const [files, setFiles] = useState([] as File[])
  const [directory, setDirectory] = useState(props.directory)
  useEffect(() => {
    getFiles(directory, "-time").then((response) => {
        setFiles(response)}
    )
    console.log("end useEffect")
  }, [directory])
  
  const nestDirectory = (nestedDirectoryName: string, _e: any) => {
    console.log("nestDirectory:", nestedDirectoryName)
    setDirectory(`${directory}/${nestedDirectoryName}`)
  }

  return (
    <>
      <ul>
      {
        files.map((file) => {
          return <li key={file.name} onClick={(e) => nestDirectory(file.name, e)}>{file.name}</li>
        })
      }
      </ul>
    </>
  );
};

