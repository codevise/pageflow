import _ from 'underscore';

export function createConcurrencyLimiter({maxConcurrent}) {
  const waiting = [];
  let running = 0;

  return {
    run(task) {
      waiting.push(task);
      startWaitingTasks();
    }
  };

  function startWaitingTasks() {
    while (running < maxConcurrent && waiting.length) {
      running++;
      waiting.shift()(_.once(release));
    }
  }

  function release() {
    running--;
    startWaitingTasks();
  }
}
