module Pageflow
  class Account < ActiveRecord::Base
    has_many :users
    has_many :entries
    has_many :folders

    belongs_to :default_theme, :class_name => 'Theme'

    validates :default_theme, :presence => true

    scope :with_landing_page, -> { where.not(:landing_page_name => '') }

    def cname_domain
      cname.split('.').pop(2).join('.')
    end
  end
end
