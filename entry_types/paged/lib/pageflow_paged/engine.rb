module PageflowPaged
  # Rails integration
  class Engine < ::Rails::Engine
    isolate_namespace PageflowPaged

    config.paths.add('lib', eager_load: true)
    config.i18n.load_path += Dir[config.root.join('config', 'locales', '**', '*.yml').to_s]

    initializer 'pageflow_paged.assets.precompile' do |app|
      app.config.assets.precompile += %w[
        pageflow_paged/editor.js
        pageflow_paged/editor.css
      ]
    end
  end
end
