const thisServerUrl = "http://127.0.0.1";
const thisServerPort = 5500;

function publicFolderUrl(fileName) {
  return `${thisServerUrl}:${thisServerPort}/${fileName}`;
}

module.exports = { thisServerPort, thisServerUrl, publicFolderUrl };
