module PageflowScrolled
  class Section < Pageflow::ApplicationRecord
    include Pageflow::SerializedConfiguration
    include Pageflow::RevisionComponent

    # belongs_to :chapter
    has_many :content_elements
  end
end
