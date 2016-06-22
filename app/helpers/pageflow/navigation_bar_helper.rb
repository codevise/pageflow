module Pageflow
  module NavigationBarHelper
    def navigation_bar_css_class(entry, options = {})
      [
        options[:class],
        entry.home_button.enabled? ? 'with_home_button' : nil,
        entry.overview_button.enabled? ? 'with_overview_button' : nil
      ].compact.join(' ')
    end
  end
end
