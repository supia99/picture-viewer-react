import { Link } from "react-router-dom"

type props = {
  to: string
  className?: string,
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  children?: React.ReactNode
}
export const DmLink = ({to, className, onClick, children}: props) => {
  return <Link to={"/doujinnomori" + to} className={className} onClick={onClick}>{children}</Link>
}