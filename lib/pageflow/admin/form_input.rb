module Pageflow
  module Admin
    # @api private
    class FormInput
      attr_reader :attribute_name

      def initialize(attribute_name, options)
        @attribute_name = attribute_name
        @options = options
      end

      def build(form_builder)
        options = @options.respond_to?(:call) ? @options.call : @options
        form_builder.input(attribute_name, options)
      end
    end
  end
end
