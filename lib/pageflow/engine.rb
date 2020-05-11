require 'yajl'
require 'state_machines-activerecord'
require 'state_machine_job'
require 'paperclip'
require 'aws-sdk-s3'
require 'friendly_id'
require 'devise'
require 'cancan'
require 'jbuilder'
require 'htmlentities'
require 'kramdown'
require 'react-rails'
require 'with_advisory_lock'

require 'active_admin'
require 'activeadmin-searchable_select'

require 'bourbon'
require 'jquery-ui-rails'
require 'jquery-layout-rails'
require 'backbone-rails'
require 'marionette-rails'
require 'jquery-fileupload-rails'
require 'jquery-minicolors-rails'
require 'wysihtml/rails'
require 'i18n-js'
require 'http_accept_language'
require 'pageflow-public-i18n'

require 'pageflow_paged'
require 'pageflow_scrolled'
require 'symmetric-encryption'

if Gem::Specification.find_all_by_name('pageflow-react', '>= 0.0').any?
  fail('The pageflow-react gem has been merged into the pageflow gem. ' \
       'See the pageflow changelog for update instructions.')
end

module Pageflow
  # Rails integration
  class Engine < ::Rails::Engine
    isolate_namespace Pageflow

    config.paths.add('app/views/components', autoload: true)
    config.paths.add('lib', autoload: true)

    def eager_load!
      # Manually eager load `lib/pageflow` as the least bad option:
      #
      # - Autoload paths are not eager loaded in production.
      #
      # - `lib` cannot be an eager load path since otherwise templates
      #   in `lib/generators` are also executed.
      #
      # - `lib/pageflow` cannot be an eager load path since eager load
      #   paths are automatically used as autoload paths. That way
      #   `lib/pageflow/admin/something.rb` could be autoloaded via
      #   `Admin::Something`.
      #
      # - Using `require` in `lib/pageflow.rb` disables code
      #   reloading.
      #
      # - Using `require_dependency` in `lib/pageflow.rb` does not
      #   activate code reloading either since it requires the
      #   autoload path to be set up correctly, which only happens
      #   during initialization.
      super

      lib_path = config.root.join('lib')
      matcher = %r{\A#{Regexp.escape(lib_path.to_s)}/(.*)\.rb\Z}

      already_required_files = [
        'pageflow/engine',
        'pageflow/global_config_api',
        'pageflow/news_item_api',
        'pageflow/version'
      ]

      Dir.glob("#{lib_path}/pageflow/**/*.rb").sort.each do |file|
        logical_path = file.sub(matcher, '\1')
        require_dependency(logical_path) unless already_required_files.include?(logical_path)
      end
    end

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
    end

    # Make sure the configuration is recreated when classes are
    # reloded. Otherwise registered page types might still point to
    # unloaded classes in development mode.
    config.to_prepare do
      Pageflow.configure!
    end

    initializer 'pageflow.factories', after: 'factory_bot.set_factory_paths' do
      if Pageflow.configured? && defined?(FactoryBot)
        FactoryBot.definition_file_paths.unshift(Engine.root.join('spec', 'factories'))
      end
    end

    # Precompile additional assets.
    initializer 'pageflow.assets.precompile' do |app|
      app.config.assets.precompile += %w(
        pageflow/application_with_simulated_media_queries.css
        pageflow/print_view.css
        pageflow/lt_ie9.js pageflow/lt_ie9.css pageflow/ie9.js pageflow/ie9.css
        pageflow/vendor.js
        pageflow/videojs
        pageflow/editor/vendor.js
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
