module PageflowScrolled
  # Storylines, chapters, sections and content elements of a revision.
  #
  # @api private
  class RevisionContent
    def initialize(revision, include_hidden: false, cutoff: false)
      @revision = revision
      @include_hidden = include_hidden
      @cutoff = cutoff
    end

    def storylines
      @storylines ||= Storyline.all_for_revision(@revision).to_a
    end

    def main_storyline
      storylines.detect { |storyline| storyline.configuration['main'] }
    end

    def chapters
      @chapters ||= all_chapters.reject do |chapter|
        !@include_hidden && only_hidden_sections?(chapter)
      end
    end

    def chapter_slug_for(chapter)
      chapter_slugs[chapter.perma_id]
    end

    def sections
      @sections ||= (@cutoff ? sections_before_cutoff : all_sections).reject do |section|
        !@include_hidden && section.configuration['hidden']
      end
    end

    def content_elements
      @content_elements ||= ContentElement.all_for_revision(@revision).where(section: sections).to_a
    end

    private

    def only_hidden_sections?(chapter)
      chapter_sections = sections_by_chapter_id.fetch(chapter.id, [])

      chapter_sections.any? &&
        chapter_sections.all? { |section| section.configuration['hidden'] }
    end

    def sections_by_chapter_id
      @sections_by_chapter_id ||= all_sections.group_by(&:chapter_id)
    end

    def sections_before_cutoff
      (storylines.first || Storyline.new).sections_before_cutoff_section
    end

    def all_sections
      @all_sections ||= Section.all_for_revision(@revision).to_a
    end

    def all_chapters
      @all_chapters ||= Chapter.all_for_revision(@revision).to_a
    end

    def chapter_slugs
      @chapter_slugs ||= ChapterSlugs.new(all_chapters).to_h
    end
  end
end
