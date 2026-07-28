import Backbone from 'backbone';

// Backbone indexes models by id. Since files of different types can
// share ids, collections that combine file types would treat files as
// duplicates of each other and silently drop them. Looking models up by
// cid keeps them apart. Lookups by plain id remain ambiguous in such
// collections.
export function cidBasedGet(obj) {
  if (obj && obj.cid) {
    return this._byId[obj.cid];
  }

  return Backbone.Collection.prototype.get.call(this, obj);
}
