//= require_self
//= require_tree ./features

pageflow.features = (function(){
  var tests = {},
      results = {},
      ready = new $.Deferred();

  return {
    off: {},
    on: {},
    unset: {},

    add: function(name, test) {
      var s = name.replace(/ /g, '_');

      this.off[s] = function() {
        window.localStorage['override ' + name] = 'off';
        pageflow.log('Feature off: ' + name, {force: true});
      };

      this.on[s] = function() {
        window.localStorage['override ' + name] = 'on';
        pageflow.log('Feature on: ' + name, {force: true});
      };

      this.unset[s] = function() {
        window.localStorage.removeItem('override ' + name);
        pageflow.log('Feature unset: ' + name, {force: true});
      };

      tests[name] = test;
    },

    has: function(name) {
      if (this.ready().state() != 'resolved') {
        throw 'Feature detection has not finished yet.';
      }

      if (!results.hasOwnProperty(name)) {
        throw 'Unknown feature "' + name +'".';
      }

      return results[name];
    },

    ready: function() {
      return ready.promise();
    },

    detect: function() {
      var promises = {};

      var asyncHas = function(name) {
        var runTest = function() {
          if (pageflow.debugMode() &&
              window.localStorage &&
              typeof window.localStorage['override ' + name] !== 'undefined') {
            var value = (window.localStorage['override ' + name] === 'on');
            pageflow.log('FEATURE OVERRIDDEN ' + name + ': ' + value, {force: true});
            return value;
          }
          else {
            return tests[name](asyncHas);
          }
        };

        promises[name] = promises[name] || $.when(runTest(name));
        return promises[name];
      };

      asyncHas.not = function(name) {
        return asyncHas(name).pipe(function(result) {
          return !result;
        });
      };

      asyncHas.all = function(/* arguments */) {
        return $.when.apply(null, arguments).pipe(function(/* arguments */) {
          return _.all(arguments);
        });
      };

      $.when.apply(null, _.map(_.keys(tests), function(name) {
        return asyncHas(name).then(function(result) {
          var cssClassName = name.replace(/ /g, '_');

          $('body').toggleClass('has_' + cssClassName, !!result);
          $('body').toggleClass('has_no_' + cssClassName, !result);

          results[name] = !!result;
        });
      })).then(ready.resolve);

      return this.ready();
    }
  };
}());