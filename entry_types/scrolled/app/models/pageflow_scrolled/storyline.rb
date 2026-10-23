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

    scope :excluding_trash, -> { where.not(role: 'trash').or(where(role: nil)) }

    def role
      super || (configuration['main'] ? 'main' : 'excursions')
    end

    def insert_chapter(chapter, position:)
      transaction do
        chapters.where('position >= ?', position).update_all('position = position + 1')
        chapter.update!(storyline: self, position:)
      end
    end

    def sections_before_cutoff_section
      sections_before(cutoff_section)
    end

    def self.create_defaults(draft)
      create!(revision: draft, role: 'main')
      create!(revision: draft, role: 'excursions', position: 1)
    end

    def self.all_for_revision(revision)
      super.excluding_trash
    end

    def self.find_or_create_trash_for(revision)
      revision.with_lock do
        where(revision:, role: 'trash').first ||
          create!(revision:,
                  role: 'trash',
                  position: where(revision:).maximum(:position).to_i + 1)
      end
    end

    def self.after_copy(revision, purpose:)
      return if %i[snapshot restore].include?(purpose)

      where(revision:, role: 'trash').destroy_all
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
