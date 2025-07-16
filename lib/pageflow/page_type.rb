module Pageflow
  # Base class for defining page types.
  class PageType
    # View path to the html template.
    def template_path
      File.join('pageflow', name, 'page')
    end

    # Name to display in editor.
    def translation_key
      "#{translation_key_prefix}.page_type_name"
    end

    # Translation key for a one line description of the page type.
    def description_translation_key
      "#{translation_key_prefix}.page_type_description"
    end

    # Translation key for the category the page type shall be
    # displayed in inside the page type select menu.
    def category_translation_key
      "#{translation_key_prefix}.page_type_category_name"
    end

    # Translation key for a markdown text fragment describing the page
    # type.
    def help_entry_translation_key
      "#{translation_key_prefix}.help_entries.page_type"
    end

    # Common prefix of all page type translation keys.
    def translation_key_prefix
      "pageflow.#{name}"
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

    # ActiveRecord models to be copied together with a revision.
    #
    # This allows authors of PageTypes to attach models to the Pageflow
    # revision mechanism.
    #
    # Example:
    #     class Rainbow < ActiveRecord::Base
    #       include Pageflow::RevisionComponent
    #
    #       [...]
    #     end
    #
    #     class RainbowPageType < Pageflow::PageType
    #       name 'rainbow'
    #
    #       def revision_components
    #         [Rainbow]
    #       end
    #     end
    #
    def revision_components
      []
    end

    # File types to enable when this page type is registered..
    # @returns {Array<FileType>}
    def file_types
      []
    end

    # Current plugin version
    def export_version
      "Pageflow::#{name.camelize}::VERSION".constantize
    rescue NameError
      begin
        "#{name.camelize}::VERSION".constantize
      rescue NameError
        raise "PageType #{name} needs to define export_version."
      end
    end

    # Gets included in JSON file during export of an entry.
    # The host application needs to compare this version with the version (above)
    # for each page type before importing.
    # Defaults to the plugins version but can be overwritten during registry of the page type,
    # using the same notation as version requirements in the Gemfile.
    def import_version_requirement
      export_version
    end

    # A list of hashes used to determine a thumbnail for a page. Each
    # hash in the list must contain two keys: `attribute` and
    # `file_collection`.
    #
    # For each item, the given attribute is fetched from the page
    # configuration and used to find a file from the given
    # collection. `file_collection` must equal the collection_name of
    # a registered {FileType}. The first file found is used as
    # thumbnail.
    #
    #     [
    #       {attribute: 'thumbnail_image_id', file_collection: 'image_files'},
    #       {attribute: 'background_image_id', file_collection: 'image_files'}
    #     ]
    #
    # It is possible to specify further conditions under which the
    # candidate may be used via `if` or `unless` keys:
    #
    #     [
    #       {
    #         attribute: 'video_id',
    #         file_collection: 'video_files',
    #         if: {
    #           attribute: 'background_type',
    #           value: 'video',
    #         }
    #       },
    #       {
    #         attribute: 'image_id',
    #         file_collection: 'image_files',
    #         unless: {
    #           attribute: 'background_type',
    #           value: 'video',
    #         }
    #       }
    #     ]
    #
    # The candidate will only be used if the given attribute has the
    # given value.
    #
    # @returns {Array<Hash>}
    def thumbnail_candidates
      [
        {
          file_collection: 'image_files',
          attribute: 'thumbnail_image_id'
        },
        {
          file_collection: 'image_files',
          attribute: 'background_image_id',
          unless: {
            attribute: 'background_type',
            value: 'video'
          }
        },
        {
          file_collection: 'image_files',
          attribute: 'poster_image_id',
          if: {
            attribute: 'background_type',
            value: 'video'
          }
        },
        {
          file_collection: 'video_files',
          attribute: 'video_file_id',
          if: {
            attribute: 'background_type',
            value: 'video'
          }
        }
      ]
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
    #         'pageflow/rainbow/page_type'
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
    def json_seed_template; end

    # Helper method to define the name of a subclassed page type.
    def self.name(name = nil)
      return super() unless name

      define_method :name do
        name
      end
    end
  end
end
