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

      def title
        @chapter.configuration['title']
      end

      def restore
        Storyline.transaction do
          case kind
          when 'chapter' then restore_chapter
          when 'contentElements' then restore_content_elements
          else restore_section
          end
        end
      end

      def destroy
        @chapter.destroy
      end

      private

      def metadata
        @chapter.configuration['trash']
      end

      def restore_chapter
        origin_storyline.insert_chapter(@chapter, position: origin_position)
        @chapter.update!(configuration: @chapter.configuration.except('trash'))

        @chapter
      end

      def restore_section
        section = sections.first

        insert_into_origin_chapter(section)
        @chapter.reload.destroy

        section
      end

      def restore_content_elements
        content_elements = sections.first.content_elements.to_a

        insert_into_origin_section(content_elements)
        @chapter.reload.destroy

        content_elements
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

      def insert_into_origin_section(content_elements)
        sections = Section.all_for_revision(@revision)

        if (section = sections.find_by(perma_id: origin_perma_id))
          section.insert_content_elements(content_elements, position: origin_position)
        else
          section = sections.first || raise(DestinationMissing)
          section.insert_content_elements(
            content_elements,
            position: (section.content_elements.maximum(:position) || -1) + 1
          )
        end
      end

      def origin_storyline
        Storyline.all_for_revision(@revision).find_by(perma_id: origin_perma_id) ||
          raise(DestinationMissing)
      end
    end
  end
end
