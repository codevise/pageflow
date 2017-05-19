module Pageflow
  class Theming < ActiveRecord::Base
    belongs_to :account
    has_many :widgets, as: :subject

    has_many :entries

    scope :with_home_url, -> { where.not(home_url: '') }
    scope :for_request, ->(request) { Pageflow.config.theming_request_scope.call(all, request) }

    validates :account, :presence => true
    validates_inclusion_of(:theme_name, in: lambda do |theming|
      Pageflow.config_for(theming.account).themes.names
    end)

    def resolve_widgets(options = {})
      widgets.resolve(Pageflow.config_for(account), options)
    end

    def cname_domain
      cname.split('.').pop(2).join('.')
    end

    def theme
      Pageflow.config_for(account).themes.get(theme_name)
    end

    def name
      I18n.t('pageflow.admin.themings.name', :account_name => account.name, :theme_name => theme_name)
    end

    def copy_defaults_to(revision)
      widgets.copy_all_to(revision)
      copy_default_meta_tags(revision)
    end

    def copy_default_meta_tags(revision)
      revision.update(
        author: default_author.presence || Pageflow.config.default_author_meta_tag,
        publisher: default_publisher.presence || Pageflow.config.default_publisher_meta_tag,
        keywords: default_keywords.presence || Pageflow.config.default_keywords_meta_tag
      )
    end
  end
end
