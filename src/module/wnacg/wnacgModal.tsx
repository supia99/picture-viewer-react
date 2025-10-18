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
        setMaxPage(Number(response.data.maxPage));
        console.log(
          `thisPage: ${response.data.thisPage} maxPage: ${response.data.maxPage}`
        );
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
              {[...Array(maxPage)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setThisPage(i + 1)}
                  className={i + 1 === thisPage ? "thisPage" : "page"}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="modal-closed"></div>
      )}
    </>
  );
};
