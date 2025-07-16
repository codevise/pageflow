module Pageflow
  module Admin
    # @api private
    class FeaturesTab < ViewComponent
      def build(resource)
        feature_target = resource.is_a?(Site) ? resource.account : resource
        render('admin/features/form', resource: feature_target)
      end
    end
  end
end
