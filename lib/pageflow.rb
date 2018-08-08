require 'pageflow/engine'
require 'pageflow/global_config_api'
require 'pageflow/news_item_api'
require 'pageflow/version'

module Pageflow
  extend GlobalConfigApi
  extend NewsItemApi

  def self.routes(router)
    router.instance_eval do
      namespace :admin do
        resources :users do
          resources :memberships
        end

        resources :entries do
          resources :memberships
        end

        resources :accounts do
          resources :memberships
        end
      end

      mount Pageflow::Engine, at: '/'
    end
  end

  def self.active_admin_settings(config)
    config.before_action do
      I18n.locale = current_user.try(:locale) || http_accept_language.compatible_language_from(I18n.available_locales) || I18n.default_locale
    end
  end

  def self.active_admin_load_path
    Dir[Pageflow::Engine.root.join('admins')].first
  end

  def self.built_in_page_types_plugin
    BuiltInPageTypesPlugin.new
  end

  def self.built_in_widget_types_plugin
    BuiltInWidgetTypesPlugin.new
  end
end
