module Pageflow
  module Admin
    module AccountsHelper
      def share_providers_input_collection
        Pageflow.config.available_share_providers.map do |provider|
          [provider.to_s.camelize, provider]
        end
      end
    end
  end
end
