module Pageflow
  module MetaTagsHelper
    def meta_tags_for_entry(entry)
      render partial: 'pageflow/meta_tags/entry', locals: {
        keywords: entry.keywords.presence || Pageflow.config.default_keywords_meta_tag,
        author: entry.author.presence || Pageflow.config.default_author_meta_tag,
        publisher: entry.publisher.presence || Pageflow.config.default_publisher_meta_tag
      }
    end
  end
end
