module Pageflow
  # @api private
  module MetaTagsHelper
    def meta_tags_for_entry(entry)
      render partial: 'pageflow/meta_tags/entry', locals: meta_tags_data_for_entry(entry)
    end

    def meta_tags_data_for_entry(entry)
      {
        keywords: entry.keywords,
        author: entry.author,
        publisher: entry.publisher
      }
    end
  end
end
