module PageflowPaged
  # Rails integration
  class Engine < ::Rails::Engine
    isolate_namespace PageflowPaged

    config.paths.add('lib', eager_load: true)
  end
end
