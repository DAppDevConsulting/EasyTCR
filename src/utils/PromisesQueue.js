export class PromisesQueueStep {
  constructor (source, customData) {
    this.promiseSource = source;
    this.started = false;
    this.finished = false;
    this.failed = false;
    this.customData = customData;
  }

  run () {
    this.started = true;
    return new Promise((resolve, reject) => {
      this.promiseSource().then(() => {
        this.finished = true;
        this.failed = false;
        resolve();
      }).catch((err) => {
        this.finished = false;
        this.started = false;
        this.failed = true;
        console.log(err);
        reject(err);
      });
    });
  }
}

export default class PromisesQueue {
  constructor () {
    this.steps = [];
    this._currentStepIndex = -1;
  }

  add (promiseSource, customData) {
    this.steps.push(new PromisesQueueStep(promiseSource, customData));
    return this;
  }

  next () {
    if (this.currentStep() && !this.currentStep().finished) {
      throw new Error('Unable to run next step until current step is not finished');
    }
    if (this.complete()) {
      throw new Error('queue already complete!');
    }
    if (this.steps.length) {
      this._currentStepIndex++;
      return this.currentStep()
        .run()
        .catch(() => this._currentStepIndex--);
    }
    return Promise.resolve();
  }

  currentStep () {
    if (this._currentStepIndex < 0) {
      return null;
    }

    return this.steps[this._currentStepIndex];
  }

  actualStep () {
    return this.steps[this.actualStepIndex()];
  }

  complete () {
    return this._currentStepIndex >= this.steps.length - 1 && this.currentStep() && this.currentStep().finished;
  }

  actualStepIndex () {
    if (this.steps.length && !this.complete()) {
      if (this._currentStepIndex < 0 || this.currentStep().finished) {
        return this._currentStepIndex + 1;
      }

      return this._currentStepIndex;
    }

    return -1;
  }
}
