module Pageflow
  class WidgetTypes
    include Enumerable

    attr_reader :defaults_by_role

    def initialize
      clear
    end

    def register(widget_type, options = {})
      @widget_types[widget_type.name] = widget_type

      if options[:default]
        widget_type.roles.each do |role|
          defaults_by_role[role] = widget_type
        end
      end
    end

    def clear
      @widget_types = {}
      @defaults_by_role = {}
    end

    def each(&block)
      @widget_types.values.each(&block)
    end

    def find_by_name!(name)
      fetch_by_name(name) do
        raise "Unknown widget type with name '#{name}'."
      end
    end

    def fetch_by_name(name, &block)
      @widget_types.fetch(name, &block)
    end

    def find_all_by_role(role)
      select do |widget_type|
        widget_type.roles.include?(role)
      end
    end

    def roles
      @widget_types.values.flat_map(&:roles).uniq
    end
  end
end
