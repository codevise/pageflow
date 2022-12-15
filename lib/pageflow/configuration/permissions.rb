module Pageflow
  class Configuration
    # Permissions related options to be defined in the pageflow
    # initializer of the main app.
    class Permissions
      def initialize
        @only_admins_may_update_features = false
        @only_admins_may_see_admin_boolean = false
        @only_admins_may_update_site = false
      end

      # Restrict access to features tabs to admins. Defaults to false.
      # @since 12.1
      attr_accessor :only_admins_may_update_features

      # Restrict visibility of admin flag on user admin page to
      # admins. Defaults to false.
      # @since 12.1
      attr_accessor :only_admins_may_see_admin_boolean

      # Restrict access to site drop down on entry edit admin page
      # to admins. Defaults to false.
      # @since 12.1
      attr_accessor :only_admins_may_update_site
    end
  end
end
