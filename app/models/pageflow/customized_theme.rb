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
      theme_customization =
        Pageflow::ThemeCustomization
        .find_by(account: entry.account, entry_type_name: entry.type_name)

      new(theme,
          theme_customization&.overrides&.deep_symbolize_keys || {},
          theme_customization&.selected_file_urls || {})
    end
  end
end
