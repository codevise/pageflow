module Pageflow
  module ConfigHelper
    include RenderJsonHelper

    def editor_config_seeds
      render_json_partial('pageflow/config/editor_seeds')
    end
  end
end
