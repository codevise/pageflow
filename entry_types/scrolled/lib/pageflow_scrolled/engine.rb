require 'webpacker'

module PageflowScrolled
  # Rails integration
  class Engine < ::Rails::Engine
    isolate_namespace PageflowScrolled

    config.paths.add('lib', eager_load: true)
  end
end
