module Pageflow
  class Theming < ApplicationRecord
    include ThemeReferencer

    belongs_to :account
    has_many :widgets, as: :subject, dependent: :destroy

    has_many :entries

    scope :with_home_url, -> { where.not(home_url: '') }
    scope :with_cname, -> { where.not(cname: '') }
    scope :for_request, ->(request) { Pageflow.config.theming_request_scope.call(all, request) }

    validates :account, :presence => true

    def resolve_widgets(options = {})
      widgets.resolve(Pageflow.config_for(account), options)
    end

    def cname_domain
      cname.split('.').pop(2).join('.')
    end

    def name
      I18n.t('pageflow.admin.themings.name', :account_name => account.name, :theme_name => theme_name)
    end

    def copy_defaults_to(revision)
      widgets.copy_all_to(revision)
      copy_attributes_to(revision)
    end

    private

    def copy_attributes_to(revision)
      revision.update(
        author: default_author.presence || Pageflow.config.default_author_meta_tag,
        publisher: default_publisher.presence || Pageflow.config.default_publisher_meta_tag,
        keywords: default_keywords.presence || Pageflow.config.default_keywords_meta_tag,
        theme_name: theme_name,
        home_button_enabled: home_button_enabled_by_default
      )
    end

    def available_themes
      Pageflow.config_for(account).themes
    end
  end
end
