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

    # Callable that receives a file record and returns a hash of one
    # of the following forms:
    #
    #     {
    #       poster: "url/of/image"
    #     }
    #
    # where `poster` is an arbitrary css class infix. Use `default` to
    # skip the infix in the generated css class name. Or
    #
    #     {
    #       poster: {
    #         desktop: "desktop/url/of/image",
    #         mobile: "mobile/url/of/image"
    #       }
    #     }
    #
    # to provide different urls for the two media breakpoints.
    #
    # @return [#call]
    attr_reader :css_background_image_urls

    # Callable that returns a hash of url template strings indexed by
    # their names.
    # @return [#call]
    attr_reader :url_templates

    # @api private
    attr_reader :custom_attributes

    # Create file type to be returned in {PageType#file_types}.
    #
    # @example
    #
    #   Pageflow::FileType.new(model: 'Pageflow::Rainbow::File',
    #                          editor_partial: 'pageflow/rainbow/editor/files/file')
    #
    # @param [Hash] options
    # @option options [ActiveRecord::Base, String] :model
    #   Required. Name of model representing the file. Model reference
    #   still works, but is deprecated
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
    # @option options [#call] :css_background_image_urls
    #   Optional. See {#css_background_image_urls}
    # @option options [#call] :url_templates
    #   Optional. Callable returning a hash of url template strings
    #   indexed by their names.
    # @option options [Array<Symbol>] :custom_attributes
    #   Optional. Array of strings containing attribute names that are
    #   custom to this file type
    def initialize(options)
      @model_string_or_reference = options.fetch(:model)
      @partial = options[:partial]
      @editor_partial = options[:editor_partial]
      @collection_name_or_blank = options[:collection_name]
      @nested_file_types = options.fetch(:nested_file_types, [])
      @top_level_type = options.fetch(:top_level_type, false)
      @css_background_image_urls = options[:css_background_image_urls]
      @css_background_image_class_prefix = options[:css_background_image_class_prefix]
      @url_templates = options.fetch(:url_templates, -> { {} })
      @custom_attributes = convert_custom_attributes_option(options[:custom_attributes])
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
    def css_background_image_class_prefix
      @css_background_image_class_prefix || model.model_name.singular
    end

    def css_background_image_urls_for(file, **options)
      if call_arity(css_background_image_urls) == 1
        css_background_image_urls.call(file)
      else
        css_background_image_urls.call(file, **options)
      end
    end

    # @api private
    def param_key
      model.model_name.param_key.to_sym
    end

    # @api private
    alias short_name param_key

    # @api private
    def type_name
      model.name
    end

    # @api private
    def i18n_key
      model.model_name.i18n_key
    end

    private

    def convert_custom_attributes_option(custom_attributes)
      if custom_attributes.is_a?(Array)
        custom_attributes.each_with_object({}) do |attribute_name, result|
          result[attribute_name] = {permitted_create_param: true}
        end
      elsif custom_attributes.is_a?(Hash)
        custom_attributes
      else
        {}
      end
    end

    def call_arity(callable)
      # lambda's #call method always claims to have no required
      # parameters:
      #
      #   lambda { |file| }.method(:call).arity # => -1
      #   lambda { |file, entry:| }.method(:call).arity # => -1
      #
      # Use arity of lambda itself instead:
      #
      #   lambda { |file| }.arity # => 1
      #   lambda { |file, entry:| }.arity # => 1
      return callable.arity if callable.respond_to?(:arity)

      callable.method(:call).arity
    end
  end
end
