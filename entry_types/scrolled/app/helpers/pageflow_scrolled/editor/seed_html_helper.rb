module PageflowScrolled
  module Editor
    # @api private
    module SeedHtmlHelper
      include EntryJsonSeedHelper
      include ReactServerSideRenderingHelper
      include Pageflow::WidgetsHelper

      def scrolled_editor_iframe_seed_html_script_tag(entry)
        html = render(template: 'pageflow_scrolled/entries/show',
                      locals: {
                        :@entry => entry,
                        :@widget_scope => :editor,
                        :@skip_ssr => true,
                        :@seed_options => {
                          skip_collections: true,
                          translations: {include_inline_editing: true}
                        }
                      })

        content_tag(:script,
                    html.gsub('</', '<\/').html_safe,
                    type: 'text/html',
                    data: {template: 'iframe_seed'})
      end
    end
  end
end
