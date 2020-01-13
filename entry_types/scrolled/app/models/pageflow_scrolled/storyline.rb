module PageflowScrolled
  class Storyline < Pageflow::ApplicationRecord
    SECTIONS_ORDER = [
      'pageflow_scrolled_chapters.position ASC',
      'pageflow_scrolled_sections.position ASC'
    ].join(',')

    CONTENT_ELEMENTS_ORDER = [
      'pageflow_scrolled_chapters.position ASC',
      'pageflow_scrolled_sections.position ASC',
      'pageflow_scrolled_content_elements.position ASC'
    ].join(',')

    include Pageflow::RevisionComponent
    include Pageflow::SerializedConfiguration

    has_many :chapters,
             -> { order('pageflow_scrolled_chapters.position ASC') },
             class_name: 'PageflowScrolled::Chapter',
             dependent: :destroy,
             inverse_of: :storyline
    has_many :sections,
             -> { reorder(SECTIONS_ORDER) },
             through: :chapters
    has_many :content_elements,
             -> { reorder(CONTENT_ELEMENTS_ORDER) },
             through: :sections

    def copy_to(revision)
      storyline = dup
      storyline.revision = revision
      storyline.save!

      chapters.each do |chapter|
        chapter.copy_to(storyline)
      end
    end
  end
end
