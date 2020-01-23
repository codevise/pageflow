module Pageflow
  class Account < ApplicationRecord
    include FeatureTarget
    include SerializationBlacklist

    has_many :entries, dependent: :restrict_with_exception
    has_many :folders, dependent: :destroy
    has_many :memberships, as: :entity, dependent: :restrict_with_exception
    has_many :users, through: :memberships, source: :user, class_name: '::User'
    has_many :entry_memberships, through: :entries, source: :memberships

    has_many :themings, dependent: :destroy
    has_many :entry_templates, dependent: :destroy
    belongs_to :default_theming, :class_name => 'Theming'

    validates :default_theming, :presence => true
    validates_associated :entry_templates

    accepts_nested_attributes_for :default_theming, :update_only => true

    scope :with_landing_page, -> { where.not(:landing_page_name => '') }

    def build_default_theming(*args)
      super.tap do |theming|
        theming.account = self
      end
    end

    def first_paged_entry_template
      EntryTemplate.find_or_initialize_by(account: self, entry_type: 'paged')
    end

    def blacklist_for_serialization
      [:features_configuration]
    end
  end
end
