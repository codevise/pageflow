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

    def self.default_slideshow_mode
      new('default_slideshow_mode', ['slideshow_mode'], 'pageflow/widgets/placeholder')
    end

    def self.phone_horizontal_slideshow_mode
      new('phone_horizontal_slideshow_mode', ['slideshow_mode'], 'pageflow/widgets/placeholder')
    end

    def self.cookie_notice_bar
      Pageflow::React.create_widget_type('cookie_notice_bar', 'cookie_notice')
    end

    def self.unmute_button
      Pageflow::React.create_widget_type('unmute_button', 'background_media_control')
    end

    def self.classic_loading_spinner
      Pageflow::React.create_widget_type('classic_loading_spinner',
                                         'loading_spinner',
                                         insert_point: :before_entry,
                                         server_rendering: true)
    end

    def self.title_loading_spinner
      Pageflow::React.create_widget_type('title_loading_spinner',
                                         'loading_spinner',
                                         insert_point: :before_entry,
                                         server_rendering: true)
    end

    def self.media_loading_spinner
      Pageflow::React.create_widget_type('media_loading_spinner',
                                         'loading_spinner',
                                         insert_point: :before_entry,
                                         server_rendering: true)
    end
  end
end
