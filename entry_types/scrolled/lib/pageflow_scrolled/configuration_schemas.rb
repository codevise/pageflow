module PageflowScrolled
  # Look up schemas describing the shape of configuration data by the
  # subject they apply to.
  class ConfigurationSchemas
    # Read schemas from JSON files. Each file contains either a single
    # schema or an array of schemas.
    #
    # @param load_path [Array<String>] Paths or globs of JSON files.
    #
    # @api private
    def self.load(load_path)
      new(load_path.flat_map { |path| Dir[path] }.uniq.sort.flat_map { |file| documents_in(file) })
    end

    # Configuration objects are rebuilt for each request, so parsing
    # results outlive them.
    #
    # @api private
    def self.documents_in(file)
      mtime = File.mtime(file)
      cached_mtime, documents = cache[file]

      return documents if cached_mtime == mtime

      cache[file] = [mtime, Array.wrap(JSON.parse(File.read(file)))]
      cache[file].last
    end

    # @api private
    def self.cache
      @cache ||= {}
    end

    # @api private
    def initialize(documents)
      @documents = documents
    end

    # @api private
    def find(model:, type_name: nil)
      by_subject[[model, type_name]]
    end

    # @api private
    def find_by_id(id)
      by_id[id]
    end

    # @api private
    def type_names(model:)
      by_subject.keys.filter_map { |subject_model, type_name| type_name if subject_model == model }
    end

    private

    def by_subject
      @by_subject ||= @documents.each_with_object({}) do |document, result|
        subject = document['x-subject']
        next unless subject

        key = [subject['model'], subject['typeName']]
        result[key] = result.key?(key) ? merge(result[key], document) : document
      end
    end

    def merge(document, other)
      document.merge(other) do |key, value, other_value|
        if %w[properties $defs].include?(key)
          merge_disjoint(value, other_value, key)
        else
          other_value
        end
      end
    end

    def merge_disjoint(value, other_value, key)
      duplicates = value.keys & other_value.keys

      if duplicates.any?
        raise(ArgumentError,
              "Conflicting #{key} in configuration schemas: #{duplicates.join(', ')}")
      end

      value.merge(other_value)
    end

    def by_id
      @by_id ||= @documents.index_by { |document| document['$id'] }
    end
  end
end
