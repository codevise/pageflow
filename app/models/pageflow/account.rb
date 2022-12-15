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
    has_many :entry_templates, dependent: :destroy
    belongs_to :default_site, :class_name => 'Site'

    validates :default_site, :presence => true
    validates_associated :entry_templates

    accepts_nested_attributes_for :default_site, :update_only => true

    scope :with_landing_page, -> { where.not(:landing_page_name => '') }

    def build_default_site(*args)
      super.tap do |site|
        site.account = self
      end
    end

    def first_paged_entry_template
      EntryTemplate.find_or_initialize_by(account: self, entry_type_name: 'paged')
    end

    def existing_and_potential_entry_templates
      entry_type_names = Pageflow.config_for(self).entry_types.map(&:name)
      existing_entry_templates = EntryTemplate.where(account_id: id).load
      allowed_existing_entry_templates =
        existing_entry_templates.select do |template|
          entry_type_names.include?(template.entry_type_name)
        end
      free_type_names =
        entry_type_names - allowed_existing_entry_templates.map(&:entry_type_name)

      potential_entry_templates = free_type_names.map do |type_name|
        EntryTemplate.new(
          account_id: id,
          entry_type_name: type_name
        )
      end

      allowed_existing_entry_templates + potential_entry_templates
    end

    def blacklist_for_serialization
      [:features_configuration]
    end
  end
end
