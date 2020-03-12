module Pageflow
  class Theming < ApplicationRecord
    belongs_to :account

    has_many :entries

    scope :with_home_url, -> { where.not(home_url: '') }
    scope :for_request, ->(request) { Pageflow.config.theming_request_scope.call(all, request) }

    validates :account, :presence => true

    def cname_domain
      cname.split('.').pop(2).join('.')
    end

    def name
      I18n.t('pageflow.admin.themings.name',
             account_name: account.name,
             theme_name: 'default')
    end

    # @deprecated Depending on what you need this for, consider
    # scoping your code to an entry type or look at a specific entry's
    # theme name.
    def theme_name
      account.first_paged_entry_template.theme_name
    end
  end
end
