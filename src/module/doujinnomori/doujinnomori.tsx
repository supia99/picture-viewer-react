import { useEffect, useRef, useState } from "react";
import { DoujinnmoriObject } from "../../model/DoujinnomoriObject";
import { getDoujinnomori } from "../../api/getDoujinnomori";
import "./doujinnomori.css";
import { DmLink } from "../doujinnomoriComponent/link";
import { saveDoujinnomori } from "../../api/saveDoujinnomori";
import { escapeURI } from "../../util/escapeURI";
// import { Link } from "react-router-dom";

export const Doujinnomori = ({ path }: { path: string }) => {
  const [dmInfos, setDmInfos] = useState([] as DoujinnmoriObject[]);
  console.log(`path: ${path}`);
  useEffect(() => {
    (async () => {
      getDoujinnomori(path ? Number(path.replace("/", "")) + 1 : 1).then(
        (response) => {
          setDmInfos(response);
        }
      );
      // TODO: 複数回PAIを叩く
      // setDmInfos(await mutiTimeGetRequest({from: relayGetCount, to: toRelayGetCount}))
      // setRelayGetCount(toRelayGetCount)
    })();
  }, [path]);

  dmInfos.length && console.log(`lenght: ${dmInfos.length}`);
  return (
    <div className="picture-container">
      <DmLink
        to={path ? "/" + (Number(path.replace("/", "")) - 1) : "/1"}
        className="prev"
      >＜</DmLink>
      <ul className="comic-card-list">
        {dmInfos.map((dmInfo) => (
          <li className="comic-card" key={dmInfo.id}>
            <p className="comic-createdAt">
              createdAt: {new Date(dmInfo.created).toLocaleDateString()}
            </p>
            {/* <p className="comic-createdAt">
              {new Date(dmInfo.modified).toLocaleDateString()}
            </p> */}
            <img src={dmInfo.thumbnailUrl} className="comic-thumbnail" onClick={() => {saveDoujinnomori({uuid: escapeURI(dmInfo.uuid), title: escapeURI(dmInfo.name)})}}/>
            {/* TODO: タイトルを押したときにタブが開き、検索がされる */}
            <p className="comic-name">{dmInfo.name}</p>
          </li>
        ))}
      </ul>
      <DmLink
        className="next"
        to={path ? "/" + (Number(path.replace("/", "")) + 1) : "/2"}
      >＞</DmLink>
    </div>
  );
};

const RELAY_TIME = 2;
const mutiTimeGetRequest = async ({
  from,
  to,
}: {
  from: number;
  to: number;
}): Promise<DoujinnmoriObject[]> => {
  let responseDmInfos: DoujinnmoriObject[] = [];
  for (let i = from; i < to; i++) {
    const response = await getDoujinnomori(i);
    responseDmInfos = [...responseDmInfos, ...response];
    console.log(response);
  }
  return responseDmInfos;
};
