module Pageflow
  # @api private
  class CustomizedTheme < SimpleDelegator
    def initialize(theme, overrides, files)
      super(theme)
      @options = __getobj__.options.deep_merge(overrides || {})
      @files = files
    end

    attr_reader :options, :files

    def self.find(entry, theme)
      config = Pageflow.config_for(entry)
      theme_customization = Pageflow.theme_customizations.get(account: entry.account,
                                                              entry_type_name: entry.type_name)

      new(theme,
          config.transform_theme_customization_overrides.call(
            theme_customization.overrides,
            entry
          ),
          config.transform_theme_customization_files.call(
            theme_customization.selected_files.transform_values(&:urls),
            entry
          ))
    end
  end
end
