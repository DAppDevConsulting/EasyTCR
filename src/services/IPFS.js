const geatway = 'https://ipfs.infura.io';
const apiServer = 'https://ipfs.infura.io:5001';

const get = async (hash) => {
  let cfg = await (await window.fetch(
    `${geatway}/ipfs/${hash}`,
    {
      method: 'get'
    }
  )).json();
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
