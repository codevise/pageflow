pageflow.app.addInitializer(function(options) {
  pageflow.Page.types = options.page_types;

  pageflow.Page.typesByName = _.reduce(options.page_types, function(memo, pageType) {
    memo[pageType.name] = pageType;
    return memo;
  }, {});
});