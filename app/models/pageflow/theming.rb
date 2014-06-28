module Pageflow
  class Theming < ActiveRecord::Base
    has_one :account, :foreign_key => :default_theming_id, :inverse_of => :default_theming

    validates_inclusion_of :theme_name, :in => ->(_) { Pageflow.config.themes.names }

    def cname_domain
      cname.split('.').pop(2).join('.')
    end

    def theme
      Pageflow.config.themes.get(theme_name)
    end

    def name
      I18n.t('admin.themings.name')
    end
  end
end
