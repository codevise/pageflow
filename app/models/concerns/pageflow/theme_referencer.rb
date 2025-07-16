module Pageflow
  module ThemeReferencer # rubocop:todo Style/Documentation
    extend ActiveSupport::Concern

    included do
      validates_inclusion_of(:theme_name, in: :available_theme_names)
    end

    def theme
      available_themes.get(theme_name)
    end

    private

    def available_theme_names
      available_themes.names
    end

    def available_themes
      raise NotImplementedError
    end
  end
end
