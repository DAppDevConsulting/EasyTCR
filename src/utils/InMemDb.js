import _ from 'lodash';

export default class InMemDb {
  constructor (...collections) {
    this._collections = new Map();
    for (let c of collections) {
      this._collections.set(
        c.name,
        {
          key: c.key,
          map: new Map()
        }
      );
    }
  }

  clear () {
    this._collections.forEach((c) => c.map.clear());
  }

  setTo (collectionName, item) {
    const collection = this._collections.get(collectionName);
    collection.map.set(item[collection.key], item);
  }

  deleteFrom (collectionName, key) {
    const collection = this._collections.get(collectionName);
    collection.map.delete(key);
  }

  hasIn (collectionName, key) {
    return this._collections.get(collectionName).map.has(key);
  }

  getByKeyFrom (collectionName, key) {
    return this._collections.get(collectionName).map.get(key);
  }

  getAllFrom (collectionName) {
    const collection = this._collections.get(collectionName);
    return [...collection.map.values()];
  }

  getKeysFrom (collectionName) {
    return [...this._collections.get(collectionName).map.keys()];
  }

  getFromJoined (collectionName, ...joinOpts) {
    const collection = this._collections.get(collectionName);
    return [...collection.map.keys()]
      .map((key) => {
        return this.getFromJoinedByKey(collectionName, key, ...joinOpts);
      });
  }

  getFromJoinedByKey (collectionName, key, ...joinOpts) {
    const collection = this._collections.get(collectionName);
    let result = _.assign({}, collection.map.get(key));
    joinOpts.forEach((option) => {
      const c = this._collections.get(option.name);
      result = _.assign(result, option.key ? c.map.get(result[option.key]) : c.map.get(key));
    });
    return result;
  }
}
