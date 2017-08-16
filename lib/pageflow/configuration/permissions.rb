module Pageflow
  class Configuration
    # Permissions related options to be defined in the pageflow
    # initializer of the main app.
    class Permissions
      def initialize
        @show_entry_features_to_non_admin = true
        @show_admin_boolean_to_non_admin = true
        @show_theming_dropdown_to_non_admin = true
      end

      # Allow non-admin users to see entry features. Defaults to true.
      # @since edge
      attr_accessor :show_entry_features_to_non_admin

      # Allow non-admin users to know about admin boolean. Defaults to
      # true.
      # @since edge
      attr_accessor :show_admin_boolean_to_non_admin

      # Allow non-admin users to see theming dropdown on entry
      # form. Defaults to true.
      # @since edge
      attr_accessor :show_theming_dropdown_to_non_admin
    end
  end
end
