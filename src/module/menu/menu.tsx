import { Dispatch, useContext, useEffect, useState } from "react";
import { SlideWaitTimeContext } from "../../PictureApp";
import { Link } from "react-router-dom";
import styles from "./menu.module.css";
import { SORT_BY_KEY_NAME, SortType } from "../../model/Constants";

type props = {
  setSlideWaitTime: (second: number) => void;
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
    <div className={styles.menu}>
      {isShowMenu && (
        <div className={styles.content}>
          <div className={styles.icons}>
            <Link to="/" className={styles.home}>
              <img src="/home.svg"></img>
            </Link>
            <a
              className={styles.return}
              onClick={() => {
                location.href = returnOneHigherPage(location.href);
              }}
            >
              <img src="/return.svg"></img>
            </a>
          </div>
          <div className={styles.options}>
            <div className={styles.slideShowTimeArea}>
              <label className={styles.slideShowLable}>slide show time(s):</label>
              <select
                value={slideShowTime}
                onChange={(e) =>
                  setSlideWaitTime(Number.parseInt(e.target.value))
                }
                className={styles.slideShowTimeInput}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option value={n}>{n}</option>
                ))}
              </select>
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
      <img
        src={isShowMenu ? "/up.svg" : "/down.svg"}
        className={styles.tab}
        onClick={() => {
          setIsShowMenu(!isShowMenu);
        }}
      ></img>
    </div>
  );
};

const returnOneHigherPage = (path: string) => {
  return path.substring(0, path.lastIndexOf("/"));
};

const setSortBy = (value: string) => {
  localStorage.setItem(SORT_BY_KEY_NAME, value);
};
export const getSortBy = () => {
  return localStorage.getItem(SORT_BY_KEY_NAME);
};
