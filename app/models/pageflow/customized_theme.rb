module Pageflow
  # @api private
  class CustomizedTheme < SimpleDelegator
    def initialize(theme, overrides, files)
      super(theme)
      @options = __getobj__.options.deep_merge(overrides || {})
      @files = files
    end

    attr_reader :options, :files

    def self.find(entry:, theme:)
      build(
        entry:,
        theme:,
        theme_customization: Pageflow.theme_customizations.get(
          site: entry.site,
          entry_type_name: entry.type_name
        )
      )
    end

    def self.build(entry:, theme:, theme_customization:)
      config = Pageflow.config_for(entry)

      new(theme,
          config.transform_theme_customization_overrides.call(
            theme_customization.overrides,
            entry:,
            theme:
          ),
          config.transform_theme_customization_files.call(
            theme_customization.selected_files.transform_values(&:urls),
            entry:,
            theme:
          ))
    end
  end
end
