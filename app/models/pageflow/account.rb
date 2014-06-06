module Pageflow
  class Account < ActiveRecord::Base
    has_many :users
    has_many :entries
    has_many :folders
    has_and_belongs_to_many :themes, :join_table => 'pageflow_accounts_themes'

    belongs_to :default_theming, :class_name => 'Theming'

    validates :default_theming, :presence => true

    attr_accessor :theme

    scope :with_landing_page, -> { where.not(:landing_page_name => '') }
  end
end
