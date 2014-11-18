module Pageflow
  class Theming < ActiveRecord::Base
    belongs_to :account
    has_many :widgets, as: :subject

    has_many :entries

    scope :with_home_url, -> { where.not(home_url: '') }
    scope :for_request, ->(request) { Pageflow.config.theming_request_scope.call(all, request) }

    validates :account, :presence => true
    validates_inclusion_of :theme_name, :in => ->(_) { Pageflow.config.themes.names }

    def cname_domain
      cname.split('.').pop(2).join('.')
    end

    def theme
      Pageflow.config.themes.get(theme_name)
    end

    def name
      I18n.t('pageflow.admin.themings.name', :account_name => account.name, :theme_name => theme_name)
    end
  end
end
