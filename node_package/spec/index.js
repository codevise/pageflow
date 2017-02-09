/*global require*/

var testsContext = require.context('../src', true, /^((?!flycheck_).)*-spec\.jsx?$/);
testsContext.keys().forEach(testsContext);

testsContext = require.context('../spec', true, /^((?!flycheck_).)*spec\.jsx?$/);
testsContext.keys().forEach(testsContext);
