module PageflowScrolled
  class Trash
    # @api private
    class Item
      delegate :id, :sections, to: :@chapter

      def initialize(chapter, revision)
        @chapter = chapter
        @revision = revision
      end

      def kind
        metadata['kind']
      end

      def origin_perma_id
        metadata['originPermaId']
      end

      def origin_position
        metadata['originPosition']
      end

      def trashed_at
        metadata['trashedAt']
      end

      def restore
        Storyline.transaction do
          restore_section
        end
      end

      private

      def metadata
        @chapter.configuration['trash']
      end

      def restore_section
        section = sections.first

        insert_into_origin_chapter(section)
        @chapter.reload.destroy

        section
      end

      def insert_into_origin_chapter(section)
        chapters = Chapter.all_for_revision(@revision)

        if (chapter = chapters.find_by(perma_id: origin_perma_id))
          chapter.insert_section(section, position: origin_position)
        else
          chapter = chapters.first || raise(DestinationMissing)
          chapter.insert_section(section, position: (chapter.sections.maximum(:position) || -1) + 1)
        end
      end
    end
  end
end
