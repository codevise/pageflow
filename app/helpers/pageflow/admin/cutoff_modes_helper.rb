module Pageflow
  module Admin
    # @api private
    module CutoffModesHelper
      def cutoff_modes_collection(config)
        config.cutoff_modes.names.map do |name|
          [t(name, scope: 'pageflow.cutoff_modes'), name]
        end
      end
    end
  end
end
