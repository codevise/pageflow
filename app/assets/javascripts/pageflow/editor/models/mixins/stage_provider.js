pageflow.stageProvider = {
  initialize: function() {
    this.stages = new Backbone.Collection(_.chain(this).result('stageMapping').pairs().map(function (pair) {
      var name = pair[0];
      var options = pair[1];

      options.file = this;
      return new pageflow.FileStage({name: name}, options);
    }, this).value());
  },

  currentStage: function() {
    return this.stages.find(function(stage) {
      return stage.get('active') || stage.get('action_required') || stage.get('failed');
    });
  }
};