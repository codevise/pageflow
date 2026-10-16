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

    def items
      chapters.includes(sections: :content_elements).map do |chapter|
        Item.new(chapter, @revision)
      end
    end

    def find_item(id)
      Item.new(chapters.find(id), @revision)
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
          trash: {
            kind:,
            originPermaId: origin_perma_id,
            originPosition: origin_position,
            trashedAt: Time.current.utc.iso8601
          }
        }
      )
    end

    def next_position
      (storyline.chapters.maximum(:position) || -1) + 1
    end

    def storyline
      @storyline ||= Storyline.find_or_create_trash_for(@revision)
    end
  end
end
