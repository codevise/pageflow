module Pageflow
  module Admin
    # @api private
    class IconLinkTo < ViewComponent
      builder_method :icon_link_to

      def build(path, options = {})
        text_node(link_to(tooltip_span(options), path, class: options[:class]))
      end

      def tag_name
        'span'
      end

      private

      def tooltip_span(options)
        content_tag(:span, options[:tooltip], class: 'tooltip_bubble')
      end
    end
  end
end
