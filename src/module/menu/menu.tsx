import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { SlideWaitTimeContext } from "../../PictureApp";
import { Link } from "react-router-dom";
import styles from "./menu.module.css";
import { SORT_BY_KEY_NAME, SortType } from "../../model/Constants";

type props = {
  setSlideWaitTime: (second: number) => void;
  isShowMenu: boolean;
  setIsShowMenu: Dispatch<SetStateAction<boolean>>;
};

export const Menu = ({ setSlideWaitTime, isShowMenu, setIsShowMenu }: props) => {
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
          setIsShowMenu((current) => !current);
          // メニューの下の要素にフォーカスを当てる
          focusNextElementAfterMenu();
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

const focusNextElementAfterMenu = () => {
  // メニューの下にある最初のフォーカス可能な要素を探す
  setTimeout(() => {
    // メニュー要素を特定
    const menuElement = document.querySelector(`.${styles.menu}`);
    if (!menuElement) return;

    // メニューの親要素を取得
    const parentElement = menuElement.parentElement;
    if (!parentElement) return;

    // 親要素内でメニュー以降の要素を検索
    const allElements = parentElement.querySelectorAll('*');
    let foundMenu = false;
    
    for (let element of allElements) {
      if (foundMenu) {
        // フォーカス可能な要素かチェック
        const focusableElement = element as HTMLElement;
        if (isFocusable(focusableElement)) {
          focusableElement.focus();
          return;
        }
      }
      if (element === menuElement || element.contains(menuElement)) {
        foundMenu = true;
      }
    }

    // メニュー以降に要素が見つからない場合、ページ全体から最初のフォーカス可能な要素を検索
    const firstFocusable = document.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }, 100); // メニューの表示/非表示アニメーションを待つ
};

const isFocusable = (element: HTMLElement): boolean => {
  // フォーカス可能な要素かどうかをチェック
  const focusableTags = ['button', 'input', 'select', 'textarea', 'a'];
  const tagName = element.tagName.toLowerCase();
  
  if (focusableTags.includes(tagName)) {
    return !element.hasAttribute('disabled') && element.tabIndex !== -1;
  }
  
  // tabindex が設定されている要素
  if (element.hasAttribute('tabindex') && element.tabIndex !== -1) {
    return true;
  }
  
  return false;
};

