module Pageflow
  class Membership < ActiveRecord::Base
    belongs_to :user
    belongs_to :entry

    validates :user, :entry, :presence => true
    validates :entry_id, :uniqueness => { :scope => :user_id }
  end
end
