import { Link } from "react-router-dom"
import "./home.css"

export const Home = () => {
  return (
    <div className="menu-container">
      <Link to="/picture" className="menu-link">picture</Link>
      <Link to="/doujinnomori" className="menu-link">doujinnomori</Link>
    </div>
  )
}