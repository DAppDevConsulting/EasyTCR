export default class Cache {
  constructor (source, obsoleteRuleSource) {
    this._source = source;
    this._obsoleteRuleSource = obsoleteRuleSource;
    this._useObsoleteRule = typeof this._obsoleteRuleSource === 'function';
    this._map = new Map();
    this._obsoleteKeys = new Set();
  }

  async get (key) {
    if (this._map.has(key)) {
      return this._map.get(key);
    }
    const item = await this._source(key);
    this._map.set(key, item);
    if (this._useObsoleteRule) {
      this._obsoleteRuleSource(item).then(() => {
        if (this._map.has(key)) {
          this._obsoleteKeys.add(key);
        }
      });
    }
    return item;
  }

  delete (key) {
    this._map.delete(key);
    this._obsoleteKeys.delete(key);
  }

  async reset (key) {
    this.delete(key);
    await this.get(key);
  }

  getKeysToRefresh () {
    const result = new Set();
    let iterator = this._obsoleteKeys.keys();
    for (let key of iterator) {
      result.add(key);
    }
    return result;
  }

  async refresh () {
    if (this._obsoleteKeys.size) {
      const keys = [...this._obsoleteKeys.keys()];
      this._obsoleteKeys.clear();
      await Promise.all(keys.map((key) => this.reset(key)));
    }
  }
}
