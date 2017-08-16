module Pageflow
  class Configuration
    # Permissions related options to be defined in the pageflow
    # initializer of the main app.
    class Permissions
      def initialize
        @non_admin_may_update_features = true
        @non_admin_may_see_admin_boolean = true
        @non_admin_may_update_theming = true
      end

      # Allow non-admin users to see entry features. Defaults to true.
      # @since edge
      attr_accessor :non_admin_may_update_features

      # Allow non-admin users to know about admin boolean. Defaults to
      # true.
      # @since edge
      attr_accessor :non_admin_may_see_admin_boolean

      # Allow non-admin users to see theming dropdown on entry
      # form. Defaults to true.
      # @since edge
      attr_accessor :non_admin_may_update_theming
    end
  end
end
