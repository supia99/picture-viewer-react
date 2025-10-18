export const escapeURI = (str: string) => {
  const replaceTargetStrings = [
    { target: "#", to: "＃" },
    { target: "&", to: "＆" },
    { target: "+", to: "＋" },
    { target: '"', to: "" },
    { target: "?", to: "？" },
    { target: "!", to: "！" },
    { target: "@", to: "＠" },
    { target: "(", to: "（" },
    { target: ")", to: "）" },
    { target: " ", to: "　" },
    { target: " [DL版]", to: "" },
    { target: "<em>", to: "" },
    { target: "</em>", to: "" },
    { target: "%", to: "％" },
    { target: "<", to: "＜" },
    { target: ">", to: "＞" },
    { target: ":", to: "：" },
    { target: "$", to: "＄" },
    { target: "'", to: "" },
    { target: "\*", to: "＊" },
    { target: ",", to: "" },
    { target: ";", to: "；" },
    { target: "=", to: "＝" },
  ];

  return replaceTargetStrings.reduce(
    (rtnStr, replaceTargetString) =>
      rtnStr.replaceAll(replaceTargetString.target, replaceTargetString.to),
    str
  );
};
