import { escapeURI } from "./escapeURI"

const main = () => {
  const str = "jgoaid<ojob>jfdoaj}"
  console.log(`${str} ${escapeURI(str)}`)
}

main();