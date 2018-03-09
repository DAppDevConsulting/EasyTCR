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

  getFromJoined (collectionName1, collectionName2) {
    const c1 = this._collections.get(collectionName1);
    const c2 = this._collections.get(collectionName2);
    return [...c1.map.keys()]
      .map((key) => {
        let poolData = _.assign(c1.map.get(key), c2.map.get(key));
        return poolData;
      });
  }
}
