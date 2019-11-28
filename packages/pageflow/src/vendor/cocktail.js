import _ from 'underscore';

//     Cocktail.js 0.3.0
//     (c) 2012 Onsi Fakhouri
//     Cocktail.js may be freely distributed under the MIT license.
//     http://github.com/onsi/cocktail
    var Cocktail = {};

    Cocktail.mixins = {};

    Cocktail.mixin = function mixin(klass) {
        var mixins = _.chain(arguments).toArray().rest().flatten().value();

        var collisions = {};

        _(mixins).each(function(mixin) {
            if (_.isString(mixin)) {
                mixin = Cocktail.mixins[mixin];
            }
            _(mixin).each(function(value, key) {
                if (_.isFunction(value)) {
                    if (klass.prototype[key]) {
                        collisions[key] = collisions[key] || [klass.prototype[key]];
                        collisions[key].push(value);
                    }
                    klass.prototype[key] = value;
                } else if (_.isObject(value)) {
                    klass.prototype[key] = _.extend({}, value, klass.prototype[key] || {});
                }
            });
        });

        _(collisions).each(function(propertyValues, propertyName) {
            klass.prototype[propertyName] = function() {
                var that = this,
                    args = arguments,
                    returnValue = undefined;

                _(propertyValues).each(function(value) {
                    var returnedValue = _.isFunction(value) ? value.apply(that, args) : value;
                    returnValue = (returnedValue === undefined ? returnValue : returnedValue);
                });

                return returnValue;
            };
        });
    };

    var originalExtend;

    Cocktail.patch = function patch(Backbone) {
        originalExtend = Backbone.Model.extend;

        var extend = function(protoProps, classProps) {
            var klass = originalExtend.call(this, protoProps, classProps);

            var mixins = klass.prototype.mixins;
            if (mixins && klass.prototype.hasOwnProperty('mixins')) {
                Cocktail.mixin(klass, mixins);
            }

            return klass;
        };

        _([Backbone.Model, Backbone.Collection, Backbone.Router, Backbone.View]).each(function(klass) {
            klass.mixin = function mixin() {
                Cocktail.mixin(this, _.toArray(arguments));
            };

            klass.extend = extend;
        });
    };

    Cocktail.unpatch = function unpatch(Backbone) {
        _([Backbone.Model, Backbone.Collection, Backbone.Router, Backbone.View]).each(function(klass) {
            klass.mixin = undefined;
            klass.extend = originalExtend;
        });
    };

export default Cocktail;
