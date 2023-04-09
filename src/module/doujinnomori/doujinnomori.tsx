import { useEffect, useRef, useState } from "react";
import { DoujinnmoriObject } from "../../model/DoujinnomoriObject";
import { getDoujinnomori } from "../../api/getDoujinnomori";
import "./doujinnomori.css";
// import { Link } from "react-router-dom";

export const Doujinnomori = ({path}: {path: string}) => {
  const [dmInfos, setDmInfos] = useState([] as DoujinnmoriObject[]);
  console.log(`path: ${path}`)
  useEffect(() => {
    (async () => {
      getDoujinnomori(1).then((response) => {
        setDmInfos(response);
      });
      // TODO: 複数回PAIを叩く
      // setDmInfos(await mutiTimeGetRequest({from: relayGetCount, to: toRelayGetCount}))
      // setRelayGetCount(toRelayGetCount)
    })();
  }, []);

  dmInfos.length && console.log(`lenght: ${dmInfos.length}`);
  return (
    <div>
      {/* <Link className="prev"></Link> */}
      <ul className="comic-card-list">
        {dmInfos.map((dmInfo) => (
          <li className="comic-card" key={dmInfo.id}>
            <p className="comic-createdAt">
              {new Date(dmInfo.created).toLocaleDateString()}
            </p>
            <p className="comic-createdAt">
              {new Date(dmInfo.modified).toLocaleDateString()}
            </p>
            <img src={dmInfo.thumbnailUrl} className="comic-thumbnail" />
            <p className="comic-name">{dmInfo.name}</p>
          </li>
        ))}
      </ul>
      {/* <Link className="next" to={}></Link> */}
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
