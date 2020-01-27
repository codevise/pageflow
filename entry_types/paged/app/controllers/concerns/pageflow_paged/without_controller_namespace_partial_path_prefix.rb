module PageflowPaged
  # @api private
  module WithoutControllerNamespacePartialPathPrefix
    extend ActiveSupport::Concern

    included do
      around_action :without_controller_namespace_partial_path_prefix
    end

    private

    def without_controller_namespace_partial_path_prefix
      old_value = ActionView::Base.prefix_partial_path_with_controller_namespace
      ActionView::Base.prefix_partial_path_with_controller_namespace = false

      yield
    ensure
      ActionView::Base.prefix_partial_path_with_controller_namespace = old_value
    end
  end
end
