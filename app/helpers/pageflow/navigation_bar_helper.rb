module Pageflow
  module NavigationBarHelper
    def navigation_bar_css_class(entry, options = {})
      [
        options[:class],
        entry.home_button.enabled? ? 'with_home_button' : nil,
        entry.overview_button.enabled? ? 'with_overview_button' : nil,
        entry.active_share_providers.empty? ? 'without_sharing_button' : nil,
        mobile_share_providers_only?(entry) ? 'mobile_sharing_only' : nil
      ].compact.join(' ')
    end

    def mobile_share_providers_only?(entry)
      entry.active_share_providers.sort.eql?(%w[telegram whats_app].sort)
    end
  end
end
