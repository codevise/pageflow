module Pageflow
  # @api private
  class CustomizedTheme < SimpleDelegator
    def initialize(theme, overrides)
      super(theme)
      @options = __getobj__.options.deep_merge(overrides || {})
    end

    attr_reader :options

    def self.find(entry, theme)
      new(theme,
          Pageflow.theme_customizations.get_overrides(account: entry.account,
                                                      entry_type_name: entry.type_name))
    end
  end
end
