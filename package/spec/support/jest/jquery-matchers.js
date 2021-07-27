// Matchers were made to be used with jest.addMatchers which is no
// longer supported by Jest 27.

const matchers = {};

Object.entries(require('jest-jquery-matchers')).forEach(([name, matcher]) =>
  matchers[name] = matcher().compare
);

expect.extend(matchers);
