import {createConcurrencyLimiter} from 'editor/utils/concurrencyLimiter';

describe('createConcurrencyLimiter', () => {
  it('runs tasks up to max concurrent right away', () => {
    const limiter = createConcurrencyLimiter({maxConcurrent: 2});
    const started = [];

    limiter.run(() => started.push(1));
    limiter.run(() => started.push(2));
    limiter.run(() => started.push(3));

    expect(started).toEqual([1, 2]);
  });

  it('starts next waiting task once a running task is released', () => {
    const limiter = createConcurrencyLimiter({maxConcurrent: 1});
    const started = [];
    let releaseFirst;

    limiter.run(release => { started.push(1); releaseFirst = release; });
    limiter.run(() => started.push(2));
    releaseFirst();

    expect(started).toEqual([1, 2]);
  });

  it('starts waiting tasks in order', () => {
    const limiter = createConcurrencyLimiter({maxConcurrent: 1});
    const started = [];

    limiter.run(release => { started.push(1); setTimeout(release); });
    limiter.run(release => { started.push(2); release(); });
    limiter.run(release => { started.push(3); release(); });

    return new Promise(resolve => setTimeout(resolve)).then(() => {
      expect(started).toEqual([1, 2, 3]);
    });
  });

  it('supports tasks that release synchronously', () => {
    const limiter = createConcurrencyLimiter({maxConcurrent: 1});
    const started = [];

    limiter.run(release => { started.push(1); release(); });
    limiter.run(release => { started.push(2); release(); });

    expect(started).toEqual([1, 2]);
  });

  it('ignores repeated release of the same task', () => {
    const limiter = createConcurrencyLimiter({maxConcurrent: 1});
    const started = [];
    let releaseFirst;

    limiter.run(release => { started.push(1); releaseFirst = release; });
    limiter.run(() => started.push(2));
    limiter.run(() => started.push(3));
    releaseFirst();
    releaseFirst();

    expect(started).toEqual([1, 2]);
  });
});
