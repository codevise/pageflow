module PageflowScrolled
  # @api private
  class Trash
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

    private

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
