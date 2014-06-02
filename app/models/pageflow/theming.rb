module Pageflow
  class Theming < ActiveRecord::Base
    belongs_to :theme
    has_one :account, :foreign_key => :default_theming_id, :inverse_of => :default_theming
    accepts_nested_attributes_for :account
  end
end