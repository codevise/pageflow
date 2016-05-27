module Pageflow
  module Admin
    # @api private
    class Tab
      attr_reader :name, :component, :required_role, :required_account_role, :resource

      def initialize(options, resource = nil)
        @name = options[:name]
        @component = options[:component]
        @required_role = options[:required_role]
        @required_account_role = options[:required_account_role]
        @admin_only = options[:admin_only]
        @resource = resource
      end

      def admin_only?
        @admin_only
      end
    end
  end
end
