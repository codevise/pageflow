module PageflowScrolled
  module Editor
    # @api private
    module SeedHtmlHelper
      def scrolled_editor_iframe_seed_html_script_tag
        html = render(template: 'pageflow_scrolled/entries/show').gsub('</', '<\/')

        content_tag(:script,
                    html.html_safe,
                    type: 'text/html',
                    data: {template: 'iframe_seed'})
      end
    end
  end
end
