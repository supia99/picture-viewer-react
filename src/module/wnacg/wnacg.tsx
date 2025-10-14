import { useEffect, useState } from "react";
import { WnacgObject } from "../../model/WnacgObject";
import axios from "axios";


const url = "http://192.168.50.134:8081/html/wnacg"

export const WNACG = () => {
  const [datas, setDatas] = useState([] as WnacgObject[]);
  useEffect(() => {
    (async () => {
      const response = (await axios.get(url)) as  {data: WnacgObject[]};
      setDatas(response.data);
      console.log(response.data)
    })();
  }, []);

  return (
    <>
      {/* {datas} */}
      {datas.map((data, index) => (
        <div key={index}>
          <h3>{data.title}</h3>
          <img src={`https:${data.thumbnailUrl}`} alt={data.title} />
        </div>
      ))}
    </>
  )
};