module PageflowScrolled
  class Section < Pageflow::ApplicationRecord
    include Pageflow::SerializedConfiguration
    include Pageflow::AutoGeneratedPermaId
    include Pageflow::NestedRevisionComponent

    belongs_to :chapter
    has_many :content_elements,
             -> { order('pageflow_scrolled_content_elements.position ASC') },
             dependent: :destroy,
             inverse_of: :section

    nested_revision_components :content_elements

    def self.all_for_revision(revision)
      joins(chapter: {storyline: :revision})
        .where(pageflow_scrolled_storylines: {revision_id: revision})
    end
  end
end
