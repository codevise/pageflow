module Pageflow
  class Configuration
    # Permissions related options to be defined in the pageflow
    # initializer of the main app.
    class Permissions
      def initialize
        @only_admins_may_update_features = false
        @only_admins_may_see_admin_boolean = false
      end

      # Restrict access to features tabs to admins. Defaults to false.
      # @since edge
      attr_accessor :only_admins_may_update_features

      # Restrict visibility of admin flag on user admin page to
      # admins. Defaults to false.
      # @since edge
      attr_accessor :only_admins_may_see_admin_boolean
    end
  end
end
