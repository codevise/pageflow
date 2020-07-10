module PageflowScrolled
  # Rails integration
  class Engine < ::Rails::Engine
    isolate_namespace PageflowScrolled

    config.paths.add('lib', eager_load: true)
    config.i18n.load_path += Dir[config.root.join('config', 'locales', '**', '*.yml').to_s]

    initializer 'pageflow_scrolled.assets.precompile' do |app|
      app.config.assets.precompile += %w[pageflow_scrolled/legacy.js]
    end
  end
end
