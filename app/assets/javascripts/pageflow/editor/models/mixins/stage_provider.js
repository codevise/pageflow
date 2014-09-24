pageflow.stageProvider = {
  initialize: function() {
    var finishedStates = [this.readyState];

    this.stages = new Backbone.Collection(_.chain(this).result('stages').slice().reverse().map(function (options) {
      var name = options.name;

      options.file = this;
      options.finishedStates = finishedStates;

      var fileStage = new pageflow.FileStage({name: name}, options);
      finishedStates = finishedStates.concat(fileStage.nonFinishedStates);

      return fileStage;
    }, this).reverse().value());
  },

  currentStage: function() {
    return this.stages.find(function(stage) {
      return stage.get('active') || stage.get('action_required') || stage.get('failed');
    });
  }
};