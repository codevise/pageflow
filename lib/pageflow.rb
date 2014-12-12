require "pageflow/engine"

module Pageflow
  def self.config(options = {})
    unless @config
      if options[:ignore_not_configured]
        return Configuration.new
      else
        raise('Pageflow has not been configured yet')
      end
    end
    @config
  end

  def self.configure(&block)
    @configure_blocks ||= []
    @configure_blocks << block
  end

  def self.configure!
    return unless @finalized

    config = Configuration.new
    @configure_blocks ||= []

    @configure_blocks.each do |block|
      block.call(config)
    end

    @after_configure_blocks.each do |block|
      block.call(config)
    end

    @config = config
  end

  def self.finalize!
    @finalized = true
    configure!
  end

  def self.after_configure(&block)
    @after_configure_blocks ||= []
    @after_configure_blocks << block
  end

  def self.routes(router)
    router.instance_eval do
      namespace :admin do
        resources :users do
          resources :memberships
        end

        resources :entries do
          resources :memberships
        end
      end

      mount Pageflow::Engine, at: '/'
    end
  end

  def self.active_admin_settings(config)
    config.before_filter do
      I18n.locale = current_user.try(:locale) || I18n.default_locale
    end
  end
end
