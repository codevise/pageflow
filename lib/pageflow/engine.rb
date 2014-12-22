require 'state_machine'
require 'state_machine_job'
require 'paperclip'
require 'aws-sdk'
require 'friendly_id'
require 'devise'
require 'cancan'
require 'jbuilder'

require 'resque_mailer'
require 'resque_scheduler'

require 'active_admin'
require 'active_admin/patches/views/attributes_table'
require 'active_admin/patches/views/table_for'
require 'active_admin/patches/views/pages/base'

require 'jquery-layout-rails'
require 'videojs_rails'
require 'backbone-rails'
require 'marionette-rails'
require 'jquery-fileupload-rails'
require 'wysihtml5x/rails'
require 'i18n-js'

module Pageflow
  # Rails integration
  class Engine < ::Rails::Engine
    isolate_namespace Pageflow

    config.autoload_paths << File.join(config.root, 'lib')
    config.autoload_paths << File.join(config.root, 'app', 'views', 'components')

    config.i18n.load_path += Dir[config.root.join('config', 'locales', '**', '*.yml').to_s]
    config.i18n.available_locales = [:en, :de]
    config.i18n.default_locale = :en

    # Supress deprecation warning. This is the future default value of the option.
    I18n.config.enforce_available_locales = true

    # FORCE RAILS TO MAKE I18N AVAILABLE TO ACTIVE ADMIN
    config.before_configuration do
      I18n.load_path += Dir[Engine.root.join('config', 'locales', '**', '*.yml').to_s]
      I18n.locale = :en
      I18n.default_locale = :en
      config.i18n.load_path += Dir[Engine.root.join('config', 'locales', '**', '*.yml').to_s]
      config.i18n.locale = :en
      # bypasses rails bug with i18n in production
      I18n.reload!
      config.i18n.reload!
    end

    # Precompile additional assets. pageflow/editor.* has to be
    # provided by the main app.
    config.assets.precompile += %w(pageflow/editor.js pageflow/editor.css
                                   pageflow/application_with_simulated_media_queries.css
                                   pageflow/print_view.css
                                   pageflow/lt_ie9.js pageflow/lt_ie9.css pageflow/ie9.js pageflow/ie9.css
                                   video-js.swf vjs.eot vjs.svg vjs.ttf vjs.woff)

    config.assets.precompile << lambda do |path|
      Pageflow.config.themes.any? do |theme|
        path == theme.stylesheet_path
      end
    end

    # Make sure the configuration is recreated when classes are
    # reloded. Otherwise registered page types might still point to
    # unloaded classes in development mode.
    config.to_prepare do
      Pageflow.configure!
    end

    # Make pageflow factories available to main app specs
    initializer "pageflow.factories", :after => "factory_girl.set_factory_paths" do
      FactoryGirl.definition_file_paths.unshift(Engine.root.join('spec', 'factories')) if defined?(FactoryGirl)
    end
  end
end
