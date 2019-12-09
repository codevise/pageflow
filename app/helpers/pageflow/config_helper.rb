module Pageflow
  module ConfigHelper
    include RenderJsonHelper

    def editor_config_seeds(entry)
      render_json_partial('pageflow/config/editor_seeds', entry: entry)
    end
  end
end
