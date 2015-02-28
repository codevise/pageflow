module Pageflow
  module Admin
    class FeaturesTab < ViewComponent
      def build(resource)
        feature_target = resource.is_a?(Theming) ? resource.account : resource
        render('admin/features/form', resource: feature_target)
      end
    end
  end
end
