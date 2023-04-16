import { useEffect } from "react";
import { getHtml } from "../../api/getHtml";

export const Wnacg = ({path}: {path: string}) => {
  useEffect(() => {
    // setPath(useLocation().pathname.replace("/wnacg", ""));
      getHtml({
        url:`https://www.wnacg.com${path}`,
        target: "wnacg",
      }).then(response => {
        document.querySelector("div#wnacg")!.innerHTML = response
      })
  }, [path]);
  return <div id="wnacg"></div>;
};
