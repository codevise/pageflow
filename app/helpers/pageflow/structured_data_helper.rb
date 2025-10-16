module Pageflow
  # @api private
  module StructuredDataHelper
    include RenderJsonHelper
    include SocialShareHelper
    include MetaTagsHelper

    def structured_data_for_entry(entry)
      custom_properties = Pageflow.config_for(entry).entry_structured_data_types.for(entry)

      content_tag(:script, type: 'application/ld+json') do
        render_json_partial('pageflow/structured_data/entry',
                            entry:,
                            meta_data: meta_tags_data_for_entry(entry),
                            custom_properties:)
      end
    end

    def structured_data_normalize_protocol(url)
      url.gsub(%r{^//}, 'https://')
    end
  end
end
