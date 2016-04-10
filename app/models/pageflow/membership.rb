module Pageflow
  class Membership < ActiveRecord::Base
    belongs_to :user
    belongs_to :entity, polymorphic: true

    validates :user, :entity, :role, presence: true
    validates :user_id, uniqueness: { scope: [:entity_type, :entity_id] }

    def entry
      entity
    end

    def entry=(value)
      self.entity = value
    end
  end
end
