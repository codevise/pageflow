module Pageflow
  class Account < ActiveRecord::Base
    include FeatureTarget

    has_many :users
    has_many :entries
    has_many :folders, dependent: :destroy
    has_many :memberships, as: :entity, dependent: :destroy
    has_many :membership_users, through: :memberships, source: :user, class_name: '::User'

    has_many :themings, dependent: :destroy
    belongs_to :default_theming, :class_name => 'Theming'

    validates :default_theming, :presence => true

    accepts_nested_attributes_for :default_theming, :update_only => true

    scope :with_landing_page, -> { where.not(:landing_page_name => '') }

    def build_default_theming(*args)
      super.tap do |theming|
        theming.account = self
      end
    end
  end
end
