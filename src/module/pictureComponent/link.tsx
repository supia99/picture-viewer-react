import { Link } from "react-router-dom"

type props = {
  to: string
  className?: string,
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  children?: React.ReactNode
}
export const PictureLink = ({to, className, onClick, children}: props) => {
  return <Link to={"/picture" + to} className={className} onClick={onClick}>{children}</Link>
}