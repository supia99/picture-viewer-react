import { useState } from "react"
import { File } from "../../model/File"

type props = {
  directory: string,
  files: File[]
}

export const Picture = ({directory, files}: props) => {
  const [fileName, setFileName] = useState(files[0])
  const src =`http://192.168.50.242:18081/hTufNas${directory}/${files[0].name}` 
  return (
    <img src={src} />
  );
};
