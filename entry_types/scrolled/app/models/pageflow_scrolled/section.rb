module PageflowScrolled
  class Section < Pageflow::ApplicationRecord
    include Pageflow::SerializedConfiguration
    include Pageflow::RevisionComponent

    delegate :entry, to: :revision

    # belongs_to :chapter
    has_many :content_elements,
             -> { order('pageflow_scrolled_content_elements.position ASC') },
             dependent: :destroy,
             inverse_of: :section
  end
end
