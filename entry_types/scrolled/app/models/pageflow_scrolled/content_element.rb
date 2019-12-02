module PageflowScrolled
  class ContentElement < Pageflow::ApplicationRecord
    include Pageflow::SerializedConfiguration

    belongs_to :section

    before_save :ensure_perma_id

    def ensure_perma_id
      self.perma_id ||= (ContentElement.maximum(:perma_id) || 0) + 1
    end
  end
end
