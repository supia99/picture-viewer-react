export const escapeURI = (str: string) => {
  const replaceTargetStrings = [
    { target: "<", to: "＜" },
    { target: ">", to: "＞" },
    { target: "#", to: "＃" },
    { target: '"', to: "" },
    { target: "%", to: "％" },
    { target: "{", to: "｛" },
    { target: "}", to: "｝" },
    { target: "|", to: "｜" },
    { target: "\\", to: "" },
    { target: "^", to: "" },
    { target: "[", to: "「" },
    { target: "]", to: "」" },
    { target: "`", to: "" },
    { target: "?", to: "？" },
    { target: "#", to: "＃" },
    { target: ":", to: "：" },
    { target: "@", to: "＠" },
    { target: "%", to: "％" },
    { target: "!", to: "！" },
    { target: "$", to: "＄" },
    { target: "&", to: "＆" },
    { target: "'", to: "" },
    { target: "(", to: "（" },
    { target: ")", to: "）" },
    { target: "\*", to: "＊" },
    { target: "+", to: "＋" },
    { target: ",", to: "" },
    { target: ";", to: "；" },
    { target: "=", to: "＝" },
    { target: " ", to: "　" },
  ];

  return replaceTargetStrings.reduce(
    (rtnStr, replaceTargetString) =>
      rtnStr.replaceAll(replaceTargetString.target, replaceTargetString.to),
    str
  );
};
