module PageflowScrolled
  module Editor
    # @api private
    module SeedHtmlHelper
      include EntryJsonSeedHelper
      include ReactServerSideRenderingHelper
      include Pageflow::WidgetsHelper
      include Pageflow::StructuredDataHelper
      include Pageflow::TextDirectionHelper
      include PageflowScrolled::CacheHelper
      include PageflowScrolled::SprocketsHelper
      include FaviconHelper
      include PacksHelper
      include WebpackPublicPathHelper

      def scrolled_editor_iframe_seed_html_script_tag(entry)
        seed_html_script_tag(entry, template: 'iframe_seed', load_inline_editing: true)
      end

      def scrolled_editor_fragment_preview_seed_html_script_tag(entry)
        seed_html_script_tag(entry,
                             template: 'fragment_preview_seed',
                             accept_collection_resets: true)
      end

      private

      def seed_html_script_tag(entry, template:, **seed_options)
        content_tag(:script,
                    seed_html(entry, **seed_options).gsub('</', '<\/').html_safe,
                    type: 'text/html',
                    data: {template:})
      end

      def seed_html(entry, **seed_options)
        separate_view.render(template: 'pageflow_scrolled/entries/show',
                             locals: {
                               entry:,
                               entry_mode: :editor,
                               skip_ssr: true,
                               skip_structured_data: true,
                               skip_feed_link_tags: true,
                               skip_hreflang_link_tags: true,
                               seed_options: {
                                 skip_collections: true,
                                 include_unused_additional_seed_data: true,
                                 include_unused_file_reference_locations: true,
                                 include_theme_translations: true,
                                 **seed_options
                               }
                             })
      end

      # Shakapacker allows a single pack tag per view and collects the
      # packs of all documents rendered by it.
      def separate_view
        self.class.new(lookup_context, assigns, controller).extend(SeedHtmlHelper)
      end
    end
  end
end
