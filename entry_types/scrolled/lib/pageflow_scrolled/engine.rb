require 'rails'
require 'pageflow/rails_version'

module PageflowScrolled
  # Rails integration
  class Engine < ::Rails::Engine
    isolate_namespace PageflowScrolled

    if Pageflow::RailsVersion.experimental?
      lib = root.join('lib')

      config.autoload_paths << lib
      config.eager_load_paths << lib

      initializer 'pageflow_scrolled.autoloading' do
        Rails.autoloaders.main.ignore(
          lib.join('generators'),
          lib.join('tasks')
        )
      end
    else
      config.paths.add('lib', eager_load: true)
    end

    config.i18n.load_path += Dir[config.root.join('config', 'locales', '**', '*.yml').to_s]

    initializer 'pageflow_scrolled.assets.precompile' do |app|
      app.config.assets.precompile += %w[pageflow_scrolled/legacy.js]
    end
  end
end
