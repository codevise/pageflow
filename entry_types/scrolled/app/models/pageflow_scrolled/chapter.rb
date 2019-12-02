module PageflowScrolled
  class Chapter < Pageflow::ApplicationRecord
    include Pageflow::SerializedConfiguration

    has_many :sections, -> { order('position ASC') }, dependent: :destroy, inverse_of: :chapter

    before_save :ensure_perma_id

    def ensure_perma_id
      self.perma_id ||= (Chapter.maximum(:perma_id) || 0) + 1
    end
  end
end
