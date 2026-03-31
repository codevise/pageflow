module PageflowScrolled
  # @api private
  module SprocketsHelper
    def scrolled_sprockets_asset_tags(entry_mode:)
      safe_join([
        javascript_include_tag('pageflow_scrolled/legacy'),
        (stylesheet_link_tag('pageflow_scrolled/ui', media: 'all') if entry_mode != :published)
      ].compact)
    end
  end
end
