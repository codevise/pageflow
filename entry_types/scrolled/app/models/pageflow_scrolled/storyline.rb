module PageflowScrolled
  class Storyline < Pageflow::ApplicationRecord # rubocop:todo Style/Documentation
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

    nested_revision_components :chapters

    def sections_before_cutoff_section
      sections_before(cutoff_section)
    end

    def self.create_defaults(draft)
      create!(revision: draft, configuration: {main: true})
      create!(revision: draft, position: 1) if draft.entry.feature_state('excursions')
    end

    private

    def sections_before(section)
      section ? sections[0...sections.index(section)] : sections
    end

    def cutoff_section
      sections.find_by_perma_id(revision.configuration['cutoff_section_perma_id'])
    end
  end
end
