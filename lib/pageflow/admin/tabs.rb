module Pageflow
  module Admin
    class Tabs
      # @api private
      def initialize
        @tabs = {}
      end

      # Display additional tabs on admin resource pages.
      #
      # @param [Symbol] resource_name A resource name like `:entry`,
      #   `:user` or `:account`
      # @param [Hash] options
      # @option options [Symbol] :name Unique identifier.
      # @option options [Arbre::Component] :component Component to
      #   render as tab contents
      # @option options [Symbol] :required_role (`nil`) Requires the
      #   current user to either have an account or entry membership
      #   with at least the given role. By default all users can see
      #   the tab.
      # @option options [Symbol] :required_account_role (`nil`)
      #   Requires the current user to have an account membership with
      #   at least the given role. By default all users can see the
      #   tab. This option only takes effect for the entry resource.
      # @option options [Boolean] :admin_only (`false`) Allow only
      #   admins to see the tab.
      def register(resource_name, options)
        @tabs[resource_name] ||= []
        @tabs[resource_name] << options
      end

      # @api private
      def find_by_resource(resource)
        @tabs.fetch(resource_name(resource), []).map do |options|
          Tab.new(options, resource)
        end
      end

      private

      def resource_name(resource)
        resource.class.model_name.param_key.to_sym
      end
    end
  end
end
