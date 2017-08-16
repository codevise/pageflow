module Pageflow
  class Configuration
    # Permissions related options to be defined in the pageflow
    # initializer of the main app.
    class Permissions
      def initialize
        @only_admins_may_update_features = false
        @only_admins_may_see_admin_boolean = false
        @only_admins_may_update_theming = false
      end

      # Allow non-admin users to see entry features. Defaults to false.
      # @since edge
      attr_accessor :only_admins_may_update_features

      # Allow non-admin users to know about admin boolean. Defaults to
      # false.
      # @since edge
      attr_accessor :only_admins_may_see_admin_boolean

      # Allow non-admin users to see theming dropdown on entry
      # form. Defaults to false.
      # @since edge
      attr_accessor :only_admins_may_update_theming
    end
  end
end
