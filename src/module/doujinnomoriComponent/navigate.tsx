import { NavigateFunction, NavigateOptions } from "react-router-dom";

export const dmNavigate = (navigate: NavigateFunction, to: string, options?: NavigateOptions) => {
  navigate("/doujinnomori" + to, options)
}