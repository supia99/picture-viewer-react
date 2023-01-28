import { Dispatch, useContext, useState } from "react";
import { SlideWaitTimeContext } from "../../App";
// import { Link } from "react-router-dom"
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
      <div className="tab" onClick={() => setIsShowMenu(!isShowMenu)}></div>
    </div>
  );
};
