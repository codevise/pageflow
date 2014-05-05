module Pageflow
  class Folder < ActiveRecord::Base
    belongs_to :account
    has_many :entries

    validates :account, :name, :presence => true
  end
end
