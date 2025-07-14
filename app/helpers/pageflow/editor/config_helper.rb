module Pageflow
  module Editor
    # @api private
    module ConfigHelper
      include RenderJsonHelper

      def editor_config_seeds(entry)
        render_json_partial('pageflow/editor/config/seeds', entry:)
      end
    end
  end
end
