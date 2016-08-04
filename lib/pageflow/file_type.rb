module Pageflow
  # Describes a type of file that can be managed in the editor and
  # used in revisions.
  class FileType
    class NotFoundError < RuntimeError
    end

    # Path of a partial rendered in the json representation of the
    # file in both the editor and published entries
    # @return {String}
    attr_reader :partial

    # Path of a partial rendered in the json representation of the
    # file inside the editor.
    # @return {String}
    attr_reader :editor_partial

    # File types that are allowed to be nested inside the file
    # @return {Array<FileType>}
    attr_reader :nested_file_types

    # Is this file type used in situations where it is not nested into
    # another file type?
    # @return {Boolean}
    attr_reader :top_level_type

    # Callable that returns a hash of url template strings indexed by
    # their names.
    # @return [#call]
    attr_reader :url_templates

    # Create file type to be returned in {PageType#file_types}.
    #
    # @example
    #
    #   Pageflow::FileType.new(model: Pageflow::Rainbow::File,
    #                          editor_partial: 'pageflow/rainbow/editor/files/file')
    #
    # @param [Hash] options
    # @option options [ActiveRecord::Base, String] :model
    #   Required. Model representing the file, or name of that model.
    # @option options [String] :partial
    #   Optional. Path of a partial to include in json representations
    #   of the file both inside  the editor and published entries.
    # @option options [String] :editor_partial
    #   Optional. Path of a partial to include in json representations
    #   of the file inside the editor.
    # @option options [String] :collection_name  Optional. String to
    #   be used in routes. Defaults to `"pageflow_rainbow_file"` for
    #   model `Pageflow::Rainbow::File`.
    # @option options [Array<FileType>] :nested_file_types
    #   Optional. Array of FileTypes allowed for nested files. Defaults to [].
    # @option options [#call] :url_templates
    #   Optional. Callable returning a hash of url template strings
    #   indexed by their names.
    def initialize(options)
      @model_string_or_reference = options.fetch(:model)
      @partial = options[:partial]
      @editor_partial = options[:editor_partial]
      @collection_name_or_blank = options[:collection_name]
      @nested_file_types = options.fetch(:nested_file_types, [])
      @top_level_type = options.fetch(:top_level_type, false)
      @url_templates = options.fetch(:url_templates, ->() { {} })
    end

    # ActiveRecord model that represents the files of this type.
    # @return {ActiveRecord::Model}
    def model
      @model ||=
        if @model_string_or_reference.is_a?(String)
          @model_string_or_reference.constantize
        else
          @model_string_or_reference
        end
    end

    # Underscored plural name for usage in routes.
    # @return {String}
    def collection_name
      if @collection_name_or_blank.blank?
        model.model_name.plural
      else
        @collection_name_or_blank
      end
    end

    # @api private
    def param_key
      model.model_name.param_key.to_sym
    end

    # @api private
    alias_method :short_name, :param_key

    # @api private
    def type_name
      model.name
    end

    # @api private
    def i18n_key
      model.model_name.i18n_key
    end
  end
end
