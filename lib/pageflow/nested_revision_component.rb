module Pageflow
  # Include in models that are declared as nested revision components
  # of other revision components.
  #
  # @since 15.5
  module NestedRevisionComponent
    # Shared functionality of revision components and nested revision
    # components.
    module Container
      extend ActiveSupport::Concern

      included do
        cattr_accessor :nested_revision_component_collection_names, default: []
      end

      # @api private
      def copy_nested_revision_component_to(record, reset_perma_ids: false)
        nested_revision_component_collection_names.each do |collection_name|
          send(collection_name).each do |nested|
            nested.copy_to(record.send(collection_name), reset_perma_ids:)
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

    def duplicate
      copy_with(reset_perma_ids: true) do |record|
        yield record if block_given?
        record.save!
      end
    end

    # @api private
    def copy_to(collection, reset_perma_ids: false)
      copy_with(reset_perma_ids:) do |record|
        collection << record
      end
    end

    private

    def copy_with(reset_perma_ids:)
      record = dup
      record.perma_id = nil if reset_perma_ids && record.respond_to?(:perma_id=)

      yield record
      copy_nested_revision_component_to(record, reset_perma_ids:)

      record
    end
  end
end
