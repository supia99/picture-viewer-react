import { useEffect, useRef, useState } from "react";
import { DoujinnmoriObject } from "../../model/DoujinnomoriObject";
import { getDoujinnomori } from "../../api/getDoujinnomori";
import styles from "./doujinnomori.module.css";
import { DmLink } from "../doujinnomoriComponent/link";
import { saveDoujinnomori } from "../../api/saveDoujinnomori";
import { escapeURI } from "../../util/escapeURI";
import { dmNavigate } from "../doujinnomoriComponent/navigate";
import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

export const Doujinnomori = ({ path }: { path: string }) => {
  const [dmInfos, setDmInfos] = useState([] as DoujinnmoriObject[]);
  const navigate = useNavigate();
  const dmModuleRef = useRef(null);

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
    (dmModuleRef.current! as any).focus();
  }, [path]);

  const keyOperation = (e: any) => {
    console.log(`e.key: ${e.key}`);
    switch (e.key) {
      case "ArrowLeft":
        // TODO: 戻る
        dmNavigate(
          navigate,
          path ? "/" + (Number(path.replace("/", "")) - 1) : "/1"
        );
        break;
      case "ArrowRight":
        // TODO: すすむ
        dmNavigate(
          navigate,
          path ? "/" + (Number(path.replace("/", "")) + 1) : "/2"
        );
        break;
      case "ArrowUp":
        // TODO: 10戻る
        const subNum = Number(path.replace("/", "")) - 10;
        dmNavigate(navigate, path && subNum > 0 ? "/" + subNum : "");
        break;
      case "ArrowDown":
        // TODO: 10進む
        dmNavigate(
          navigate,
          path ? "/" + (Number(path.replace("/", "")) + 10) : ""
        );
        break;
    }
  };

  dmInfos.length && console.log(`lenght: ${dmInfos.length}`);
  return (
    <div className={styles["picture-container"]}>
      <DmLink
        to={path ? "/" + (Number(path.replace("/", "")) - 1) : "/1"}
        className={styles.prev}
      >
        ＜
      </DmLink>
      <ul
        className={styles["comic-card-list"]}
        onKeyDown={(e) => keyOperation(e)}
        tabIndex={0}
        ref={dmModuleRef}
      >
        {dmInfos.map((dmInfo) => (
          <li className={styles["comic-card"]} key={dmInfo.id}>
            <p
              className={
                new Date(dmInfo.modified).getFullYear() -
                  new Date(dmInfo.created).getFullYear() >
                0
                  ? styles["comic-createdAt-old"]
                  : styles["comic-createdAt"]
              }
            >
              createdAt: {new Date(dmInfo.created).toLocaleDateString()}
            </p>
            {/* <p className="comic-createdAt">
              {new Date(dmInfo.modified).toLocaleDateString()}
            </p> */}
            <img
              src={dmInfo.thumbnailUrl}
              className={styles["comic-thumbnail"]}
              onClick={() => {
                saveDoujinnomori({
                  uuid: escapeURI(dmInfo.uuid),
                  title: escapeURI(dmInfo.name),
                });
              }}
            />
            {/* TODO: タイトルを押したときにタブが開き、検索がされる */}
            <p className={styles["comic-name"]}>{dmInfo.name}</p>
          </li>
        ))}
      </ul>
      <DmLink
        className={styles.next}
        to={path ? "/" + (Number(path.replace("/", "")) + 1) : "/2"}
      >
        ＞
      </DmLink>
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
