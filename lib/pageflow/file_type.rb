module Pageflow
  # Describes a type of file that can be managed in the editor and
  # used in revisions.
  class FileType
    class NotFoundError < RuntimeError
    end

    # ActiveRecord model that represents the files of this type.
    # @return {ActiveRecord::Model}
    attr_reader :model

    # Path of the partial used to render a json representation of the
    # file.
    # @return {String}
    attr_reader :editor_partial

    # Underscored plural name for usage in routes.
    # @return {String}
    attr_reader :collection_name

    # Create file type to be returned in {PageType#file_types}.
    #
    # @example
    #
    #   Pageflow::FileType.new(model: Pageflow::Rainbow::File,
    #                          editor_partial: 'pageflow/rainbow/editor/files/file')
    #
    # @param [Hash] options
    # @option options [ActiveRecord::Base] :model  Required. Model
    #   representing the file.
    # @option options [String] :editor_partial  Required. Path of the
    #   partial used to render a json representation of the file.
    # @option options [String] :collection_name  Optional. String to
    #   be used in routes. Defaults to `"pageflow_rainbow_file"` for
    #   model `Pageflow::Rainbow::File`.
    def initialize(options)
      @model = options.fetch(:model)
      @editor_partial = options.fetch(:editor_partial)
      @collection_name = options.fetch(:collection_name, model.model_name.plural)
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
