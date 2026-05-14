

const str = "Oshi no ko Season 3"
const words = str.split("")

const fisrtPart = words.slice(0,1).map(word => word.toLowerCase()).join("");
const secondPart = words[3].slice(0,1).toLowerCase() + words[4];
const result = `${fisrtPart}${secondPart}`;
console.log(result);