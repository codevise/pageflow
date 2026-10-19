module PageflowScrolled
  # Compute chapter slugs the same way as the frontend.
  #
  # @api private
  class ChapterSlugs
    def initialize(chapters)
      @chapters = chapters
    end

    def to_h
      used_slugs = Set.new

      @chapters.to_h do |chapter|
        [chapter.perma_id, slug(chapter, used_slugs)]
      end
    end

    private

    def slug(chapter, used_slugs)
      title = chapter.configuration['title']
      return "chapter-#{chapter.perma_id}" if title.blank?

      slug = Slugify.call(title)
      slug = "#{slug}-#{chapter.perma_id}" if used_slugs.include?(slug)
      used_slugs << slug

      slug
    end
  end
end
