import PromisesQueue, {PromisesQueueStep} from './PromisesQueue';

const resolveSource = () => {
  return Promise.resolve();
};

const rejectSource = () => {
  return Promise.reject(new Error('My error!'));
};

describe('PromisesQueueStep', () => {
  test('success behavior', async () => {
    const step = new PromisesQueueStep(resolveSource, {});
    expect(step.started).toBe(false);
    expect(step.finished).toBe(false);
    expect(step.failed).toBe(false);
    await step.run();
    expect(step.finished).toBe(true);
    expect(step.started).toBe(true);
  });

  test('fail behavior', async () => {
    const step = new PromisesQueueStep(rejectSource, {});
    expect(step.started).toBe(false);
    expect(step.finished).toBe(false);
    expect(step.failed).toBe(false);
    try {
      await step.run();
    } catch (err) {
      expect(step.finished).toBe(false);
      expect(step.started).toBe(false);
      expect(step.failed).toBe(true);
    }
  });
});

describe ('PromisesQueue', () => {
  test('it complete after all steps', async () => {
    const queue = new PromisesQueue()
      .add(resolveSource, {})
      .add(resolveSource, {});
    expect(queue.complete()).toBe(false);
    await queue.next();
    expect(queue.complete()).toBe(false);
    await queue.next();
    expect(queue.complete()).toBe(true);
  });

  test('it fails when next calls after complete', async () => {
    const queue = new PromisesQueue()
      .add(resolveSource, {})
      .add(resolveSource, {});
    await queue.next();
    await queue.next();
    expect(() => queue.next()).toThrow();
  });
});
