require "pageflow/engine"

module Pageflow
  def self.config
    raise('Pageflow has not been configured yet') unless @config
    @config
  end

  def self.configure(&block)
    @configure_blocks ||= []
    @configure_blocks << block
  end

  def self.configure!
    return unless @finalized

    @config = Configuration.new
    @configure_blocks ||= []

    @configure_blocks.each do |block|
      block.call(@config)
    end

    @after_configure_blocks.each do |block|
      block.call(@config)
    end
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

        resources :themings, :only => [:show, :edit, :update]
      end

      mount Pageflow::Engine, at: '/'
    end
  end
end
