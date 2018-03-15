import FileSaver from 'file-saver';

const save = (content, fileName = 'test.txt') => {
  const blob = new Blob([JSON.stringify(content)], {type: 'application/json;charset=utf-8'});
  FileSaver.saveAs(blob, fileName);
};

const isSupported = () => {
  try {
    return !!new Blob;
  } catch (err) {
    return false;
  }
};

const readAsString = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onabort = () => {
      reject(new Error('file reading was aborted'));
    };
    reader.onerror = () => {
      reject(new Error('file reading has failed'));
    };

    reader.readAsText(file);
  });
};

const readAsJson = async (file) => {
  let str = await readAsString(file);
  return JSON.parse(str);
};

export default {
  save,
  isSupported,
  readAsBinaryString: readAsString,
  readAsJson
};
