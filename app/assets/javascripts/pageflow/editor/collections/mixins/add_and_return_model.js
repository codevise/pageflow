pageflow.addAndReturnModel = {
  // Backbone's add does not return the added model. push returns the
  // model but does not trigger sort.
  addAndReturnModel: function(model, options) {
    model = this._prepareModel(model, options);
    this.add(model, options);
    return model;
  }
};

Cocktail.mixin(Backbone.Collection, pageflow.addAndReturnModel);