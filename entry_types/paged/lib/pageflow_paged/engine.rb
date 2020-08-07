module PageflowPaged
  # Rails integration
  class Engine < ::Rails::Engine
    isolate_namespace PageflowPaged

    config.paths.add('lib', eager_load: true)
    config.i18n.load_path += Dir[config.root.join('config', 'locales', '**', '*.yml').to_s]

    initializer 'pageflow_paged.assets.precompile' do |app|
      # Pageflow Paged requires an older version of React than the one
      # that comes bundled with react-rails. The React builds from the
      # originally used version of react-rails have been copied to
      # paged/vendor/assets/javascripts/<env>/pageflow_paged/vendor.
      #
      # Replicate the react-rails setup to use different React builds
      # based on the Rails environment.
      variant = Rails.env.production? ? 'production' : 'development'
      app.config.assets.paths << config.root.join('vendor', 'assets', 'javascripts', variant).to_s

      app.config.assets.precompile += %w[
        pageflow_paged/vendor.js
        pageflow_paged/editor.js
        pageflow_paged/frontend.js
        pageflow_paged/server_rendering.js
        pageflow_paged/editor.css
      ]
    end
  end
end
