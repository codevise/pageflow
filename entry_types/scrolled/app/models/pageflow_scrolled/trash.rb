module PageflowScrolled
  # @api private
  class Trash
    class DestinationMissing < StandardError; end

    def initialize(revision)
      @revision = revision
    end

    def add_section(section)
      Storyline.transaction do
        container = create_container(kind: 'section',
                                     origin_perma_id: section.chapter.perma_id,
                                     origin_position: section.position)

        section.update!(chapter: container, position: 0)
      end
    end

    def add_content_elements(content_elements, origin_section:, origin_position:)
      Storyline.transaction do
        container = create_container(kind: 'contentElements',
                                     origin_perma_id: origin_section.perma_id,
                                     origin_position:)
        container_section = container.sections.create!(
          position: 0,
          configuration: origin_section.configuration.slice('invert', 'layout')
        )

        content_elements.each_with_index do |content_element, index|
          content_element.update!(section: container_section, position: index)
        end
      end
    end

    def add_chapter(chapter)
      chapter.update!(
        storyline:,
        position: next_position,
        configuration: chapter.configuration.merge(
          'trash' => metadata(kind: 'chapter',
                              origin_perma_id: chapter.storyline.perma_id,
                              origin_position: chapter.position)
        )
      )
    end

    def items
      chapters.includes(sections: :content_elements).map do |chapter|
        Item.new(chapter, @revision)
      end
    end

    def find_item(id)
      Item.new(chapters.find(id), @revision)
    end

    def empty
      chapters.destroy_all
    end

    private

    def chapters
      existing_storyline = Storyline.find_by(revision: @revision, role: 'trash')
      return Chapter.none unless existing_storyline

      existing_storyline.chapters.reorder(position: :desc)
    end

    def create_container(kind:, origin_perma_id:, origin_position:)
      storyline.chapters.create!(
        position: next_position,
        configuration: {
          trash: metadata(kind:, origin_perma_id:, origin_position:)
        }
      )
    end

    def metadata(kind:, origin_perma_id:, origin_position:)
      {
        'kind' => kind,
        'originPermaId' => origin_perma_id,
        'originPosition' => origin_position,
        'trashedAt' => Time.current.utc.iso8601
      }
    end

    def next_position
      (storyline.chapters.maximum(:position) || -1) + 1
    end

    def storyline
      @storyline ||= Storyline.find_or_create_trash_for(@revision)
    end
  end
end
