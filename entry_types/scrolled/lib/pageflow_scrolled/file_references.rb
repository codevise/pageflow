module PageflowScrolled
  # Resolve file reference locations against a configuration to find
  # the files it points at.
  #
  # @api private
  class FileReferences
    def initialize(locations)
      @locations = locations
    end

    def for(configuration)
      @locations.flat_map do |location|
        values_at(configuration, location['path']).filter_map do |path, value|
          perma_id = to_perma_id(value)
          next unless perma_id

          {
            collection_name: location['collection'],
            perma_id:,
            path:,
            active: active?(location['activeIf'], configuration)
          }
        end
      end
    end

    private

    def to_perma_id(value)
      perma_id = Integer(value, exception: false)
      perma_id if perma_id&.positive?
    end

    def values_at(value, path, resolved_path = [])
      return [[resolved_path, value]] if path.empty?

      segment, *rest = path

      if segment == '*'
        entries(value).flat_map do |key, item|
          values_at(item, rest, resolved_path + [key])
        end
      elsif value.is_a?(Hash)
        values_at(value[segment], rest, resolved_path + [segment])
      else
        []
      end
    end

    def entries(value)
      case value
      when Array then value.each_with_index.map { |item, index| [index, item] }
      when Hash then value.to_a
      else []
      end
    end

    def active?(conditions, configuration)
      return true if conditions.blank?

      Array.wrap(conditions).all? { |condition| matches?(condition, configuration) }
    end

    def matches?(condition, configuration)
      value = value_at(configuration, condition['path'])

      return !value.nil? == condition['present'] if condition.key?('present')
      return Array.wrap(condition['not']).exclude?(value) if condition.key?('not')

      Array.wrap(condition['value']).include?(value)
    end

    def value_at(configuration, path)
      path.reduce(configuration) do |value, segment|
        value[segment] if value.is_a?(Hash)
      end
    end
  end
end
