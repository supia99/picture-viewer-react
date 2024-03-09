import { Dispatch, useContext, useEffect, useState } from "react";
import { SlideWaitTimeContext } from "../../PictureApp";
import { Link } from "react-router-dom";
import "./menu.css";
import { SORT_BY_KEY_NAME, SortType } from "../../model/Constants";

type props = {
  setSlideWaitTime: Dispatch<React.SetStateAction<number>>;
};

export const Menu = ({ setSlideWaitTime }: props) => {
  const [isShowMenu, setIsShowMenu] = useState(true);
  const slideShowTime = useContext(SlideWaitTimeContext);
  const [selectSortByState, setSortByState] = useState("");

  useEffect(() => {
    const stateBy = getSortBy() || SortType.TIME_D;
    setSortBy(stateBy);
    setSortByState(stateBy);
  }, []);

  return (
    <div className="menu">
      {isShowMenu && (
        <div className="content">
          <div className="icons">
          <Link to="/" className="home">
            <img src="public/home.svg"></img>
          </Link>
          <a
            className="return"
            onClick={() => {
              location.href = returnOneHigherPage(location.href);
            }}
          >
            <img src="public/return.svg"></img>
          </a>
          </div>
          <div className="options">
          <div className="slideShowTimeArea">
            <label className="slideShowLable">slide show time(s):</label>
            <input
              type="number"
              value={slideShowTime}
              onChange={(e) =>
                setSlideWaitTime(Number.parseInt(e.target.value))
              }
              className="slideShowTimeInput"
            />
          </div>
          <select
            value={selectSortByState}
            onChange={(e) => {
              setSortBy(e.target.value);
              setSortByState(e.target.value);
            }}
          >
            <option value={SortType.TIME_D}>日付 降順</option>
            <option value={SortType.NAME_D}>名前 降順</option>
          </select>
          </div>
        </div>
      )}
      <div
        className="tab"
        onClick={() => {
          setIsShowMenu(!isShowMenu);
        }}
      ></div>
    </div>
  );
};

const returnOneHigherPage = (path: string) => {
  return path.substring(0, path.lastIndexOf("/"));
};

const setSortBy = (value: string) => {
  localStorage.setItem(SORT_BY_KEY_NAME, value);
};
const getSortBy = () => {
  return localStorage.getItem(SORT_BY_KEY_NAME);
};
