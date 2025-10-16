import { Link } from "react-router-dom"

type props = {
  to: string
  className?: string,
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  children?: React.ReactNode
}
export const WnacgLink = ({to, className, onClick, children}: props) => {
  return <Link to={"/wnacg" + to} className={className} onClick={onClick}>{children}</Link>
}