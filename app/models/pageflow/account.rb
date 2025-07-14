module Pageflow
  class Account < ApplicationRecord
    include FeatureTarget
    include SerializationBlacklist

    has_many :entries, dependent: :restrict_with_exception
    has_many :folders, dependent: :destroy
    has_many :memberships, as: :entity, dependent: :restrict_with_exception
    has_many :users, through: :memberships, source: :user, class_name: '::User'
    has_many :entry_memberships, through: :entries, source: :memberships

    has_many :sites, dependent: :destroy
    belongs_to :default_site, class_name: 'Site'

    validates :default_site, presence: true

    accepts_nested_attributes_for :default_site, update_only: true

    scope :with_landing_page, -> { where.not(landing_page_name: '') }

    def build_default_site(*args)
      super.tap do |site|
        site.account = self
        site.build_root_permalink_directory
      end
    end

    def blacklist_for_serialization
      [:features_configuration]
    end

    def self.ransackable_attributes(_auth_object = nil)
      %w[id name]
    end

    def self.ransackable_associations(_auth_object = nil)
      []
    end
  end
end
