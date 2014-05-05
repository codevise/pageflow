module Pageflow
  # Base class for defining page types.
  class PageType
    # View path to the html template.
    def template_path
      File.join('pageflow', name, 'page')
    end

    # Name to display in editor.
    def translation_key
      "pageflow.#{name}.page_type_name"
    end

    # Override to return a string in snake_case.
    def name
      raise(NotImplementedError, 'PageType subclass needs to define a name.')
    end

    # Rails helper modules to make available in the html template.
    #
    # Example:
    #
    #     module RainbowsHelper
    #       def rainbow
    #         tag(:rainbow)
    #       end
    #     end
    #
    #     class RainbowPageType < Pageflow::PageType
    #       name 'rainbow'
    #
    #       def view_helpers
    #         [RainbowsHelper]
    #       end
    #     end
    #
    #     # page_types/pageflow/rainbow/page.html.erb
    #     <%= rainbow %>
    #
    def view_helpers
      []
    end

    # View path of a template containing additional json to pass to
    # the editor. The data is available in the javascript definition
    # of the page type's configuration editor. By default nothing is
    # added.
    #
    # In particular this can be used to make configuration options of
    # page type engines available to the editor.
    #
    # Example:
    #
    #     class RainbowPageType < Pageflow::PageType
    #       name 'rainbow'
    #
    #       def json_seed_template
    #         'pageflow/rainbow/page_type.json.jbuilder'
    #       end
    #     end
    #
    #     # page_types/pageflow/rainbow/page_type.json.jbuilder
    #     json.colors ['red', 'blue', 'yellow']
    #
    #     # page_types/pageflow/rainbow/editor.js
    #     pageflow.ConfigurationEditorView.register('rainbow', {
    #       configure: function() {
    #         var colors = this.options.pageType.colors;
    #         // ...
    #       }
    #     });
    #
    def json_seed_template
    end

    # Helper method to define the name of a subclassed page type.
    def self.name(name = nil)
      return super() unless name
      define_method :name do
        name
      end
    end

    # Include in your engine if it mainly defines new page types. Sets
    # up load paths so you can place all files related to a page type
    # in a single directory. The following structure is proposed for a
    # page type engine:
    #
    #    pageflow-rainbow/
    #      page_types/
    #        pageflow/
    #          rainbow/
    #            editor.js
    #            page.html.erb
    #            page_type.json.jbuilder
    #          rainbow.css.scss
    #          rainbow.js
    #      lib/
    #        pageflow/
    #          rainbow/
    #            engine.rb
    #            page_type.rb
    #
    module Engine
      extend ActiveSupport::Concern

      included do
        paths["app/views"] << 'page_types'

        initializer :assets do |config|
          Rails.application.config.assets.paths << root.join('page_types')
        end
      end
    end
  end
end
