module Pageflow
  class StubPageConfiguration # rubocop:todo Style/Documentation
    attr_reader :template

    def initialize(template)
      @template = template
    end

    def method_missing(name, *_args)
      template.tag(:span, data: {property: name})
    end

    def respond_to_missing?(_name, _include_private = false)
      true
    end
  end
end
