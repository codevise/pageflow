module Pageflow
  # Include in models that are declared as nested revision components
  # of other revision components.
  #
  # @since edge
  module NestedRevisionComponent
    # Shared functionality of revision components and nested revision
    # components.
    module Container
      extend ActiveSupport::Concern

      included do
        cattr_accessor :nested_revision_component_collection_names, default: []
      end

      # @api private
      def copy_nested_revision_component_to(record)
        nested_revision_component_collection_names.each do |collection_name|
          send(collection_name).each do |nested|
            nested.copy_to(record.send(collection_name))
          end
        end
      end

      # Macro methods to declare nested revision components
      module ClassMethods
        # Call this macro in the body of a class which includes
        # `RevisionComponent` or `NestedRevisionComponent` and pass
        # the name of an association that shall be included when the
        # revision component is copied to a new revision. The
        # associated model needs to be a `NestedRevisionComponent`.
        def nested_revision_components(*collection_names)
          self.nested_revision_component_collection_names = collection_names
        end
      end
    end

    extend ActiveSupport::Concern
    include Container

    # @api private
    def copy_to(collection)
      record = dup
      collection << record

      copy_nested_revision_component_to(record)
    end
  end
end
