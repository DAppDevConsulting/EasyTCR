import PromisesQueue from './PromisesQueue';

export default class PromisesQueueWatcher {
  constructor () {
    this.queue = new PromisesQueue();
    this._isRunning = false;
  }

  add (promiseSource, customData) {
    if (!this.queue || this.queue.complete()) {
      this._isRunning = false;
      this.queue = new PromisesQueue();
    }
    this.queue.add(promiseSource, customData);
    this._runIfNecessary();
  }

  _runIfNecessary () {
    if (this._isRunning) {
      return;
    }
    this._isRunning = true;
    this._runNextStep();
  }

  async _runNextStep () {
    await this.queue.next();
    if (!this.queue.complete()) {
      await this._runNextStep();
    } else {
      this._isRunning = false;
    }
  }
}
