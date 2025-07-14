module Pageflow
  class EntryTemplate < ApplicationRecord
    include ThemeReferencer
    include SerializedConfiguration

    serialize :default_share_providers, coder: JSON

    belongs_to :site
    delegate :enabled_feature_names, to: :site

    has_many :widgets, as: :subject, dependent: :destroy

    validates :site, presence: true
    validates :entry_type_name, presence: true
    validates :entry_type_name,
              uniqueness: {
                scope: :site
              }

    def entry_type
      Pageflow.config.entry_types.find_by_name!(entry_type_name)
    end

    def translated_entry_type_name
      I18n.t("activerecord.values.pageflow/entry.type_names.#{entry_type_name}")
    end

    def resolve_widgets(options = {})
      widgets.resolve(Pageflow.config_for(self), options)
    end

    def copy_defaults_to(revision)
      widgets.copy_all_to(revision)
      copy_attributes_to(revision)
    end

    def share_providers=(share_providers)
      self.default_share_providers = share_providers
    end

    def share_providers
      default_share_providers
    end

    def default_share_providers
      self[:default_share_providers].presence ||
        hashify_provider_array(Pageflow.config.default_share_providers)
    end

    private

    def copy_attributes_to(revision)
      revision.update(
        author: default_author.presence || Pageflow.config.default_author_meta_tag,
        publisher: default_publisher.presence || Pageflow.config.default_publisher_meta_tag,
        keywords: default_keywords.presence || Pageflow.config.default_keywords_meta_tag,
        share_providers: default_share_providers,
        theme_name:,
        configuration:,
        locale: default_locale
      )
    end

    def available_themes
      Pageflow.config_for(self).themes
    end

    def hashify_provider_array(arr)
      Hash[arr.reject(&:blank?).map { |v| [v.to_s, true] }]
    end
  end
end
