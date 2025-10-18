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
}
export const WnacgModal = ({ isOpened, setIsOpenedModal, sampleId }: props) => {
  const [samplePictures, setSamplePictures] = useState([] as wancgPicture[]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (isOpened && sampleId) {
      // Fetch sample pictures based on sampleId
      (async () => {
        const axiosWnacg = axios.create({
          baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/sample/wnacg`,
        });
        const response = await axiosWnacg.get(`/${sampleId}`);
        setTitle(response.data.title);
        setSamplePictures(response.data.pictureUrls);
      })();
    }
  }, [isOpened, sampleId]);

  return (
    <>
      {isOpened ? (
        <div className="modal-opened"  onClick={() => setIsOpenedModal && setIsOpenedModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{title}</h2>
            <div className="close-button" onClick={() => setIsOpenedModal && setIsOpenedModal(false)}>×</div>
            <div className="image-gallery">
              {samplePictures.map((picture, index) => (
                <div key={index}>
                  <img src={picture.sampleUrl} alt={`Sample ${index}`} />
                  <p>{index}</p>
                </div>
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
