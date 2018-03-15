const IPFSConfig = require('../cfg.json').IPFS;
const geatway = IPFSConfig.geatway;
const apiServer = IPFSConfig.apiServer;

const defaultConfig = require('../defaultConfig');

const get = async (hash) => {
  let cfg;
  try {
    cfg = await (await window.fetch(
      `${geatway}/ipfs/${hash}`,
      {
        method: 'get'
      }
    )).json();
  } catch (err) {
    console.log(err);
    cfg = defaultConfig;
    cfg.name = 'Invalid IPFS Hash';
    cfg.id = 'Unknown id';
  }
  return cfg;
};

const contentToFile = async (name, content) => {
  return new File([content], `${name}.json`, {type: 'application/json'});
};

const upload = async (file) => {
  try {
    let formData = new FormData();
    formData.append('file', file);
    let result = await (await window.fetch(
      `${apiServer}/api/v0/add`,
      {
        method: 'post',
        body: formData
      }
    )).json();
    return result.Hash;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default {
  get,
  upload,
  contentToFile
};
