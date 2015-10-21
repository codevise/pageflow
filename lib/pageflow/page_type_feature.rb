module Pageflow
  # A feature to enable a {PageType}.
  #
  # @since 0.9
  class PageTypeFeature < Feature
    attr_reader :page_type

    def initialize(page_type)
      super("page_type.#{page_type.name}")
      @page_type = page_type
    end

    def enable(config)
      config.page_types.register(page_type)
    end

    def name_translation_key
      "pageflow.#{page_type.name}.page_type_feature_name"
    end
  end
end
