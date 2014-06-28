module Pageflow
  class Theming < ActiveRecord::Base
    belongs_to :account

    validates :account, :presence => true
    validates_inclusion_of :theme_name, :in => ->(_) { Pageflow.config.themes.names }

    def cname_domain
      cname.split('.').pop(2).join('.')
    end

    def theme
      Pageflow.config.themes.get(theme_name)
    end

    def name
      I18n.t('admin.themings.name', :account_name => account.name, :theme_name => theme_name)
    end
  end
end
