module Pageflow
  class Site < ApplicationRecord
    belongs_to :account

    has_many :entry_templates, dependent: :destroy
    has_many :entries
    has_many :permalink_directories, -> { order('path ASC') }

    scope :with_home_url, -> { where.not(home_url: '') }
    scope :for_request, ->(request) { Pageflow.config.site_request_scope.call(all, request) }

    validates :account, :presence => true
    validates_associated :entry_templates

    delegate :enabled_feature_names, to: :account

    def display_name
      name.presence || I18n.t('pageflow.admin.sites.default_name')
    end

    def name_with_account_prefix
      [account.name, name].compact.join(' - ')
    end

    def host
      Pageflow.config.site_url_options(self)&.dig(:host)
    end

    def cname_domain
      cname.split('.').pop(2).join('.')
    end

    def first_paged_entry_template
      entry_templates.find_or_initialize_by(entry_type_name: 'paged')
    end

    # @deprecated Depending on what you need this for, consider
    # scoping your code to an entry type or look at a specific entry's
    # theme name.
    def theme_name
      first_paged_entry_template.theme_name
    end
  end
end
