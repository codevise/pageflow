pageflow.app.addInitializer(function(options) {
  pageflow.features.enable('editor', options.entry.enabled_feature_names);
});
