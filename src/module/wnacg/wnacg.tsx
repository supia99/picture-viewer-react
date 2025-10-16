import { useEffect, useState } from "react";
import { WnacgObject } from "../../model/WnacgObject";
import axios from "axios";
import "./wnacg.css";
import { WnacgLink } from "./wnacgLInk";
import { Link } from "react-router-dom";

const url = `${import.meta.env.VITE_BACKEND_BASE_URL}/html/wnacg`;

type props = {
  path: string;
}

export const WNACG = ({path}: props) => {
  const [datas, setDatas] = useState([] as WnacgObject[]);
  const [pageType, setPageType] = useState("同人誌");
  const [page, setPage] = useState(1);
  useEffect(() => {
    const pathParts = path.split("/");
    const tmpPageType = pathParts[2] || "同人誌";
    setPageType(tmpPageType);
    const tmpPage = pathParts[3] && parseInt(pathParts[3]) || 1;
    setPage(tmpPage);
    const requestUrl = `${url}/${tmpPageType}/${tmpPage}`;
    console.log(`url: ${requestUrl} pageType: ${tmpPageType} page: ${tmpPage}`);
    (async () => {
      const response = (await axios.get(requestUrl)) as { data: WnacgObject[] };
      setDatas(response.data);
      console.log(response.data);
    })();
  }, [path]);

  return (
    <>
      <div className="header">
        <Link to="/" className="home">
          <img src="/home.svg"></img>
        </Link>
        <WnacgLink to="/同人誌/1" className="menu-button">同人誌</WnacgLink>
        <WnacgLink to="/CG/1" className="menu-button">CG</WnacgLink>
        <WnacgLink to="/単行本/1" className="menu-button">単行本</WnacgLink>
        <WnacgLink to="/雑誌/1" className="menu-button">雑誌</WnacgLink>
      </div>
      <div className="navigate-area">
        <WnacgLink to={`/${pageType}/${page - 1}`} className="back">戻る</WnacgLink>
        <ul className="list">
          {datas.map((data, index) => (
            <li key={index} className="list-item">
              {/* TODO: モーダルでサンプル画像を表示したい */}
              {/* TODO: ダウンロード機能をつけたい */}
              <div className="link">
                <img src={`https:${data.thumbnailUrl}`} alt={data.title} />
                <p className="title">{data.title}</p>
              </div>
            </li>
          ))}
        </ul>
        <WnacgLink to={`/${pageType}/${page + 1}`} className="forward">進む</WnacgLink>
      </div>
    </>
  );
};
