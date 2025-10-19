import styles from "./PictureApp.module.css";
import { useLocation } from "react-router-dom";
import { Doujinnomori } from "./module/doujinnomori/doujinnomori";

export default function DoujinnomoriApp() {
  const path = useLocation().pathname;
  // console.log(`path:${path}`);
  return (
      <div className={styles.app}>
        <Doujinnomori path={path.replace("/doujinnomori", "")}/>
      </div>
  );
}

