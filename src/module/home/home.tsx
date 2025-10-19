import { Link } from "react-router-dom"
import styles from "./home.module.css"

export const Home = () => {
  return (
    <div className={styles["menu-container"]}>
      <Link to="/picture" className={styles["menu-link"]}>picture</Link>
      <Link to="/wnacg" className={styles["menu-link"]}>wnacg</Link>
    </div>
  )
}