module Pageflow
  class Folder < ApplicationRecord # rubocop:todo Style/Documentation
    belongs_to :account
    has_many :entries

    validates :account, :name, presence: true
  end
end
