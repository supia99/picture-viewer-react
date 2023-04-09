import { useEffect, useRef, useState } from "react";
import { DoujinnmoriObject } from "../../model/DoujinnomoriObject";
import { getDoujinnomori } from "../../api/getDoujinnomori";
import "./doujinnomori.css"

export const Doujinnomori = () => {
  const [dmInfos, setDmInfos] = useState([] as DoujinnmoriObject[]);
  // const [relayGetCount, setRelayGetCount] = useState(1)
  // let refFirstRef = useRef(true)
  useEffect(() => {
    (async() => {
      // const toRelayGetCount = relayGetCount + RELAY_TIME
      // console.log(`relayGet: ${relayGetCount} to ${toRelayGetCount}`)
      getDoujinnomori(1).then((response) => {
        setDmInfos(response)
      })
      // TODO: 複数回PAIを叩く
      // setDmInfos(await mutiTimeGetRequest({from: relayGetCount, to: toRelayGetCount}))
      // setRelayGetCount(toRelayGetCount)
    })()
  }, []);

  dmInfos.length && console.log(`lenght: ${dmInfos.length}`)
  return (
    <ul className="comic-card-list">
      {dmInfos.map((dmInfo) => (
        <li className="comic-card" key={dmInfo.id}>
          <p className="comic-createdAt">{new Date(dmInfo.created).toLocaleDateString()}</p>
          <p className="comic-createdAt">{new Date(dmInfo.modified).toLocaleDateString()}</p>
          <img src={dmInfo.thumbnailUrl} className="comic-thumbnail"/>
          <p className="comic-name">{dmInfo.name}</p>
        </li>
        
      )
      )}
    </ul>
  );
};

const RELAY_TIME = 2
const mutiTimeGetRequest = async ({from, to}:{from: number, to: number}) : Promise<DoujinnmoriObject[]> => {
  let responseDmInfos: DoujinnmoriObject[] = []
  for(let i= from; i < to; i++) {
    const response = await getDoujinnomori(i);
    responseDmInfos = [...responseDmInfos, ...response]
    console.log(response)
  }
  return responseDmInfos
}