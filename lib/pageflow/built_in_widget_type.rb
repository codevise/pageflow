module Pageflow
  class BuiltInWidgetType < WidgetType
    attr_reader :name, :roles, :partial_path

    def initialize(name, roles, partial_path)
      @name = name
      @roles = roles
      @partial_path = partial_path
    end

    def translation_key
      "pageflow.widgets.type_names.#{name}"
    end

    def render(template, entry)
      template.render(partial_path, entry: entry, widget_type_name: name)
    end

    def self.navigation
      new('default_navigation', ['navigation'], 'pageflow/entries/navigation')
    end

    def self.mobile_navigation
      new('default_mobile_navigation', ['mobile_navigation'], 'pageflow/entries/mobile_navigation')
    end

    def self.classic_player_controls
      new('classic_player_controls', ['player_controls'], 'pageflow/widgets/placeholder')
    end

    def self.slim_player_controls
      new('slim_player_controls', ['player_controls'], 'pageflow/widgets/placeholder')
    end
  end
end
