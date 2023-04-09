import { NavigateFunction, NavigateOptions } from "react-router-dom";


export const pictureNavigate = (navigate: NavigateFunction, to: string, options?: NavigateOptions) => {
  navigate("/picture" + to, options)
}