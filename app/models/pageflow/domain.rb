module Pageflow
  class Domain < ApplicationRecord
    belongs_to :theming

    validates_presence_of :name
    validates_uniqueness_of :name

    scope :primary, -> { where(primary: true) }
  end
end
