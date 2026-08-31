module PageflowScrolled
  # Flatten a configuration schema into the places where references to
  # files can occur.
  class FileReferenceLocations
    # @api private
    def initialize(schemas)
      @schemas = schemas
    end

    # @api private
    def for(schema)
      collect(schema, document: schema, path: [], seen: [])
    end

    private

    def collect(schema, document:, path:, seen:)
      if (ref = schema['$ref'])
        return [] if seen.include?(ref)

        schema, document = resolve(ref, document:)
        seen += [ref]
      end

      return [] unless schema.is_a?(Hash)

      references = schema['x-fileCollection'] ? [reference(schema, path)] : []

      references +
        branches(schema).flat_map { |branch| collect(branch, document:, path:, seen:) } +
        children(schema).flat_map do |name, child|
          collect(child, document:, path: path + [name], seen:)
        end
    end

    def branches(schema)
      Array(schema['anyOf']) + Array(schema['oneOf'])
    end

    def reference(schema, path)
      {
        'path' => path,
        'collection' => schema['x-fileCollection'].camelize(:lower),
        'activeIf' => schema['x-activeIf']
      }.compact
    end

    def children(schema)
      children = schema['properties']&.dup || {}
      nested = schema['items'] || schema['additionalProperties']

      children['*'] = nested if nested.is_a?(Hash)
      children
    end

    def resolve(ref, document:)
      id, pointer = ref.split('#', 2)
      target = id.empty? ? document : @schemas.find_by_id(id)

      target ? [dig(target, pointer), target] : [nil, nil]
    end

    def dig(document, pointer)
      return document if pointer.blank? || pointer == '/'

      document.dig(*pointer.delete_prefix('/').split('/'))
    end
  end
end
