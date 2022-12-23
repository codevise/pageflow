module Pageflow
  module Admin
    # A registry of additional inputs for admin forms.
    #
    # @since 0.9
    class FormInputs
      def initialize
        @resources = {}
      end

      # Register a proc which adds additional inputs to admin forms.
      #
      # @param resource_name [Symbol] A resource name like `:entry`,
      #   `:account` or `:site`
      # @param attribute_name [Symbol] The name of the additional
      #   attribute
      # @param options [Hash] Formtastic options
      def register(resource_name, attribute_name, options = {})
        @resources[resource_name] ||= []
        @resources[resource_name] << FormInput.new(attribute_name, options)
      end

      # @api private
      def build(resource_name, form_builder)
        find_all_for(resource_name).each do |form_input|
          form_input.build(form_builder)
        end
      end

      # @api private
      def permitted_attributes_for(resource_name)
        find_all_for(resource_name).map(&:attribute_name)
      end

      # @api private
      def find_all_for(resource_name)
        @resources.fetch(resource_name, [])
      end
    end
  end
end
