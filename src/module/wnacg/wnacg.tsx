import { useEffect, useState } from "react";
import { WnacgObject } from "../../model/WnacgObject";
import axios from "axios";
import "./wnacg.css";

const url = "http://192.168.50.134:8081/html/wnacg";

export const WNACG = () => {
  const [datas, setDatas] = useState([] as WnacgObject[]);
  useEffect(() => {
    (async () => {
      const response = (await axios.get(url)) as { data: WnacgObject[] };
      setDatas(response.data);
      console.log(response.data);
    })();
  }, []);

  return (
    <ul className="list">
      {datas.map((data, index) => (
        <li key={index} className="list-item">
          {/* TODO: aタグが画像を囲む */}
          {/* TODO: aタグの遷移先がない */}
          <a href={data.href} className="link">
            <img src={`https:${data.thumbnailUrl}`} alt={data.title} />
            <p className="title">{data.title}</p>
          </a>
        </li>
      ))}
    </ul>
  );
};
