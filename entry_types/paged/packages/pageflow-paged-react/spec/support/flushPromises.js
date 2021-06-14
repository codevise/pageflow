/*global process*/

// See Node API docs (https://nodejs.org/api/process.html) about
// `process`.
//
// `await flushPromises()` ensures that everything that is already
// queued on the "next tick queue" before `res` will run before the spec continues.
export const flushPromises = () => new Promise(res => process.nextTick(res));
