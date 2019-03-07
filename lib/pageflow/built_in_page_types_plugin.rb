module Pageflow
  class BuiltInPageTypesPlugin < Plugin
    def configure(config)
      config.page_types.register(BuiltInPageType.plain)
      config.page_types.register(BuiltInPageType.video)
      config.page_types.register(BuiltInPageType.audio)
    end
  end
end
