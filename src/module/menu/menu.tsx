import { Dispatch, useContext, useState } from "react";
import { SlideWaitTimeContext } from "../../PictureApp";
import { Link } from "react-router-dom";
import "./menu.css";

type props = {
  setSlideWaitTime: Dispatch<React.SetStateAction<number>>;
};
export const Menu = ({ setSlideWaitTime }: props) => {
  const [isShowMenu, setIsShowMenu] = useState(true);
  const slideShowTime = useContext(SlideWaitTimeContext);
  return (
    <div className="menu">
      {/* <Link to="/">home</Link> */}
      {/* {slideShowTime} */}
      {isShowMenu && (
        <div className="content">
          <Link to="/">home</Link>
          <a
            onClick={() => {
              location.href = returnOneHigherPage(location.href);
            }}
          >
            戻る
          </a>
          <div className="slideShowTimeArea">
            <p>slide show time(s):</p>
            <input
              type="number"
              value={slideShowTime}
              onChange={(e) =>
                setSlideWaitTime(Number.parseInt(e.target.value))
              }
              className="slideShowTimeInput"
            />
          </div>
        </div>
      )}
      {/* TODO: 上のディレクトリに移動できる */}
      <div className="tab" onClick={() => setIsShowMenu(!isShowMenu)}></div>
    </div>
  );
};

const returnOneHigherPage = (path: string) => {
  return path.substring(0, path.lastIndexOf("/"));
};
