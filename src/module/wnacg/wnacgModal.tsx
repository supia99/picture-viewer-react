import axios from "axios";
import { useEffect, useState } from "react";
import "./wnacgModal.css";

type props = {
  isOpened: boolean;
  setIsOpenedModal?: React.Dispatch<React.SetStateAction<boolean>>;
  sampleId?: string;
};

type wancgPicture = {
  sampleUrl: string;
  srcUrl: string;
  page: number;
};
export const WnacgModal = ({ isOpened, setIsOpenedModal, sampleId }: props) => {
  const [samplePictures, setSamplePictures] = useState([] as wancgPicture[]);
  const [title, setTitle] = useState("");
  const [thisPage, setThisPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [pageArray, setPageArray] = useState<number[]>([1, 2, 3, 4]);

  useEffect(() => {
    if (isOpened && sampleId) {
      // Fetch sample pictures based on sampleId
      (async () => {
        const axiosWnacg = axios.create({
          baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/sample/wnacg`,
        });
        const response = await axiosWnacg.get(`/${sampleId}/page/1`);
        setTitle(response.data.title);
        setSamplePictures(response.data.pictureUrls);
        setThisPage(1);
        const maxPageNumber = Number(response.data.maxPage);
        setMaxPage(maxPageNumber);
        console.log(
          `thisPage: ${response.data.thisPage} maxPage: ${maxPageNumber}`
        );
        const tmpPageArray = [...Array(7)]
          .map((_, i) => 1 + i - 3)
          .filter((i) => i > 0 && i <= maxPageNumber);
        setPageArray(tmpPageArray);
        console.log(`tmpPageArray: ${tmpPageArray} maxPage: ${maxPageNumber}, thisPage: 1`);
      })();
    }
  }, [isOpened, sampleId]);

  useEffect(() => {
    if (isOpened && sampleId && thisPage !== 1) {
      (async () => {
        const axiosWnacg = axios.create({
          baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/sample/wnacg`,
        });
        const response = await axiosWnacg.get(`/${sampleId}/page/${thisPage}`);
        setSamplePictures(response.data.pictureUrls);
        console.log(
          `useEffect[thisPage]thisPage: ${response.data.thisPage} maxPage: ${response.data.maxPage}`
        );
        const tmpPageArray = [...Array(7)]
          .map((_, i) => thisPage + i - 3)
          .filter((i) => i > 0 && i <= maxPage);
        setPageArray(tmpPageArray);
        console.log(`tmpPageArray: ${tmpPageArray}`);
      })();
    }
  }, [thisPage]);

  // TODO: ZoomUpモーダル
  // TODO: Modalモジュールに切り出し
  return (
    <>
      {isOpened ? (
        <div
          className="modal-opened"
          onClick={() => setIsOpenedModal && setIsOpenedModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{title}</h2>
            <div className="image-gallery">
              {samplePictures.map((picture, index) => (
                <div key={index}>
                  <img src={picture.sampleUrl} alt={`Sample ${index}`} />
                  <p>{picture.page}</p>
                </div>
              ))}
            </div>
            <div className="pagenation">
              {!pageArray.includes(1) && (
                <button
                  key={1}
                  // FIXME: レンダリングが動作しない
                  onClick={() => {
                    setThisPage(1);
                    console.log(`setThisPage: 1`);
                  }}
                  className="page first-page"
                >
                  1
                </button>
              )}
              {!pageArray.includes(1) && pageArray[0] - 1 !== 1 && (
                <span className="skip-page">・・・</span>
              )}
              {pageArray.map((v) => (
                <button
                  key={v}
                  onClick={() => setThisPage(v)}
                  className={v === thisPage ? "this-page" : "page"}
                >
                  {v}
                </button>
              ))}
              {!pageArray.includes(maxPage) &&
                pageArray[pageArray.length - 1] + 1 !== maxPage && (
                  <span className="skip-page">・・・</span>
                )}
              {!pageArray.includes(maxPage) && (
                <button
                  key={maxPage}
                  onClick={() => setThisPage(maxPage)}
                  className="page last-page"
                >
                  {maxPage}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="modal-closed"></div>
      )}
    </>
  );
};
