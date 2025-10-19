import { useEffect, useState } from "react";
import { WnacgObject } from "../../model/WnacgObject";
import axios from "axios";
import "./wnacg.css";
import { WnacgLink } from "./wnacgLInk";
import { Link } from "react-router-dom";
import { WnacgModal } from "./wnacgModal";
import { toast, Toaster } from "react-hot-toast";

const url = `${import.meta.env.VITE_BACKEND_BASE_URL}/html/wnacg`;

type props = {
  path: string;
};

export const WNACG = ({ path }: props) => {
  const [datas, setDatas] = useState([] as WnacgObject[]);
  const [pageType, setPageType] = useState("同人誌");
  const [page, setPage] = useState(1);
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const [sampleId, setSampleId] = useState("");
  const [thisPage, setThisPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [pageArray, setPageArray] = useState<number[]>([]);

  useEffect(() => {
    const pathParts = path.split("/");
    const tmpPageType = pathParts[2] || "同人誌";
    setPageType(tmpPageType);
    const tmpPage = (pathParts[3] && parseInt(pathParts[3])) || 1;
    setPage(tmpPage);
    const requestUrl = `${url}/${tmpPageType}/${tmpPage}`;
    console.log(`url: ${requestUrl} pageType: ${tmpPageType} page: ${tmpPage}`);
    (async () => {
      const response = (await axios.get(requestUrl)) as {
        data: { data: WnacgObject[]; thisPage: number; maxPage: number };
      };
      const thisPageNumber = Number(response.data.thisPage);
      const maxPageNumber = Number(response.data.maxPage);
      setDatas(response.data.data);
      setThisPage(thisPageNumber);
      setMaxPage(maxPageNumber);
      console.log(response.data);
      const tmpPageArray = [...Array(7)]
          .map((_, i) => thisPageNumber + i - 3)
          .filter((i) => i > 0 && i <= maxPageNumber)
      setPageArray(
        tmpPageArray
      );
      console.log(`tmpPageArray: ${tmpPageArray} maxPage: ${maxPageNumber}, thisPage: ${thisPageNumber}`);
    })();
  }, [path]);

  return (
    <>
      <div className="header">
        <Link to="/" className="home">
          <img src="/home.svg"></img>
        </Link>
        <WnacgLink to="/同人誌/1" className="menu-button">
          同人誌
        </WnacgLink>
        <WnacgLink to="/CG/1" className="menu-button">
          CG
        </WnacgLink>
        <WnacgLink to="/単行本/1" className="menu-button">
          単行本
        </WnacgLink>
        <WnacgLink to="/雑誌/1" className="menu-button">
          雑誌
        </WnacgLink>
        <WnacgLink to="/Cosplay/1" className="menu-button">
          コスプレ
        </WnacgLink>
      </div>
      <div className="navigate-area">
        <WnacgLink to={`/${pageType}/${page - 1}`} className="back">
          戻る
        </WnacgLink>
        <ul className="list">
          {datas.map((data, index) => (
            <li key={index} className="list-item" id={data.id}>
              <div
                className="item-content"
                onClick={() => {
                  setSampleId(data.id);
                  setIsOpenedModal(true);
                }}
              >
                <img src={`https:${data.thumbnailUrl}`} alt={data.title} />
                <div className="description">
                  <p className="title">{data.title}</p>
                  <p>
                    {data.pageNo}P {data.uploadDate}
                  </p>
                </div>
              </div>
              <img
                src="/download.svg"
                className="DL"
                onClick={(e) => download(e)}
              ></img>
            </li>
          ))}
        </ul>
        <WnacgLink to={`/${pageType}/${page + 1}`} className="forward">
          進む
        </WnacgLink>
      </div>
      <div className="pagenation">
        {!pageArray.includes(1) && (
          <WnacgLink key={1} to={`/${pageType}/1`} className="page first-page">
            1
          </WnacgLink>
        )}
        {!pageArray.includes(1) && pageArray[0] - 1 !== 1 && (
          <span className="skip-page">・・・</span>
        )}
        {pageArray.map((v) => (
          <WnacgLink
            key={v}
            to={`/${pageType}/${v}`}
            className={v === thisPage ? "this-page" : "page"}
          >
            {v}
          </WnacgLink>
        ))}
        {!pageArray.includes(maxPage) &&
          pageArray[pageArray.length - 1] + 1 !== maxPage && (
            <span className="skip-page">・・・</span>
          )}
        {!pageArray.includes(maxPage) && (
          <WnacgLink
            key={maxPage}
            to={`/${pageType}/${maxPage}`}
            className="page last-page"
          >
            {maxPage}
          </WnacgLink>
        )}
      </div>
      <Toaster />
      <WnacgModal
        isOpened={isOpenedModal}
        setIsOpenedModal={setIsOpenedModal}
        sampleId={sampleId}
      />
    </>
  );
};

const download = async (e: React.MouseEvent) => {
  e.stopPropagation();
  const id = e.currentTarget.parentElement?.id;
  const title = e.currentTarget.parentElement
    ?.querySelector("img")!
    .getAttribute("alt");
  const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/dl/wnacg`,
  });
  const response = await axiosInstance.get(`/${id}`, { params: { title } });
  if (response.data === "SUCCESS") {
    toast.success(
      `SUCCESS 
      id: ${id} 
      title: ${title}`,
      { className: "success-toast" }
    );
  } else {
    toast.error(
      `DL FAILED 
      id: ${id}
      title: ${title} ${response.data}`,
      { className: "error-toast" }
    );
    console.error(`ダウンロードに失敗しました ${id} ${title} ${response.data}`);
  }
};
