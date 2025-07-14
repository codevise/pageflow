module Pageflow
  class Folder < ApplicationRecord
    belongs_to :account
    has_many :entries

    validates :account, :name, presence: true
  end
end
