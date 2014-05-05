module Pageflow
  # Base class for Arbre components defined by Pageflow. Store the
  # builder method name to facilitate calling it in specs.
  class ViewComponent < Arbre::Component
    class << self
      attr_reader :builder_method_name
    end

    def self.builder_method(name)
      @builder_method_name = name
      super
    end
  end
end
