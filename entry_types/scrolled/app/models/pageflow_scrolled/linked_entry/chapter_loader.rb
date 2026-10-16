module PageflowScrolled
  class LinkedEntry
    # Load chapters of linked entries. Chapters of the published
    # revisions and drafts of all entries are loaded at once.
    #
    # @api private
    class ChapterLoader
      def initialize(entries)
        @entries = entries
        @chapters_by_revision = {}
      end

      def for(entry, perma_ids)
        return [] if perma_ids.empty?

        published = revision_chapters(entry.published_revision)
        draft = revision_chapters(entry.draft)

        perma_ids.filter_map do |perma_id|
          linked_chapter(perma_id, published[perma_id], draft[perma_id])
        end
      end

      private

      RevisionChapter = Struct.new(:slug, :title)

      def linked_chapter(perma_id, published, draft)
        return unless published || draft

        Chapter.new(perma_id:,
                    slug: (published || draft).slug,
                    preview_slug: (draft || published).slug,
                    title: (draft || published).title)
      end

      def revision_chapters(revision)
        return {} unless revision

        @chapters_by_revision[revision.id] ||= begin
          chapters = chapters_by_revision_id.fetch(revision.id, [])
          slugs = ChapterSlugs.new(chapters).to_h

          chapters.to_h do |chapter|
            [chapter.perma_id,
             RevisionChapter.new(slugs[chapter.perma_id], chapter.configuration['title'])]
          end
        end
      end

      def chapters_by_revision_id
        @chapters_by_revision_id ||=
          PageflowScrolled::Chapter
          .joins(:storyline)
          .where(pageflow_scrolled_storylines: {revision_id: revision_ids})
          .merge(PageflowScrolled::Storyline.excluding_trash)
          .order(PageflowScrolled::Chapter::POSITION_ORDER)
          .select('pageflow_scrolled_chapters.*', 'pageflow_scrolled_storylines.revision_id')
          .group_by(&:revision_id)
      end

      def revision_ids
        @entries.flat_map { |entry| [entry.published_revision&.id, entry.draft&.id] }.compact
      end
    end
  end
end
