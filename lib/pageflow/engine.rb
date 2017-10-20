require 'yajl'
require 'state_machine'
require 'state_machine_job'
require 'paperclip'
require 'aws-sdk'
require 'friendly_id'
require 'devise'
require 'cancan'
require 'jbuilder'
require 'htmlentities'
require 'kramdown'
require 'react-rails'

require 'resque_mailer'
require 'resque_scheduler'

require 'active_admin'

require 'jquery-layout-rails'
require 'backbone-rails'
require 'marionette-rails'
require 'jquery-fileupload-rails'
require 'wysihtml5x/rails'
require 'i18n-js'
require 'http_accept_language'
require 'pageflow-public-i18n'

if Gem::Specification.find_all_by_name('pageflow-react', '>= 0.0').any?
  fail('The pageflow-react gem has been merged into the pageflow gem. ' \
       'See the pageflow changelog for update instructions.')
end

module Pageflow
  # Rails integration
  class Engine < ::Rails::Engine
    isolate_namespace Pageflow

    config.autoload_paths << File.join(config.root, 'lib')
    config.autoload_paths << File.join(config.root, 'app', 'views', 'components')

    config.i18n.load_path += Dir[config.root.join('config', 'locales', '**', '*.yml').to_s]
    config.i18n.available_locales = [:en, :de] | PublicI18n.available_locales
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

    # Make sure the configuration is recreated when classes are
    # reloded. Otherwise registered page types might still point to
    # unloaded classes in development mode.
    config.to_prepare do
      Pageflow.configure!
    end

    initializer "pageflow.factories", :after => "factory_girl.set_factory_paths" do
      if Pageflow.configured? && defined?(FactoryGirl)
        FactoryGirl.definition_file_paths.unshift(Engine.root.join('spec', 'factories'))
      end
    end

    # Precompile additional assets. pageflow/editor.* has to be
    # provided by the main app.
    initializer 'pageflow.assets.precompile' do |app|
      app.config.assets.precompile += %w(
        pageflow/editor.js pageflow/editor.css
        pageflow/application_with_simulated_media_queries.css
        pageflow/print_view.css
        pageflow/lt_ie9.js pageflow/lt_ie9.css pageflow/ie9.js pageflow/ie9.css
        pageflow/vendor.js
        video-js.swf vjs.eot vjs.svg vjs.ttf vjs.woff
      )

      app.config.assets.precompile << lambda do |path, _filename|
        Pageflow.config.themes.any? do |theme|
          path == theme.stylesheet_path
        end
      end

      app.config.assets.precompile << lambda do |path, filename|
        filename.start_with?(Engine.root.join('app/assets').to_s) &&
          !['.js', '.css', ''].include?(File.extname(path))
      end
    end
  end
end
