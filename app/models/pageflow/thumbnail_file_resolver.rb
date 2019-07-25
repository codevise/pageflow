module Pageflow
  class ThumbnailFileResolver < Struct.new(:entry, :candidates, :configuration)
    def find_thumbnail
      candidates.detect do |candidate|
        condition = candidate[:unless] || candidate[:if]
        next if condition && !condition_met?(condition, candidate[:unless])

        file = find_positioned_file_by_candiate(candidate)
        break file if file
      end || PositionedFile.null
    end

    private

    def condition_met?(condition, negated)
      if !condition.is_a?(Hash) ||
         condition.keys.sort != [:attribute, :value]
        raise(ArgumentError,
              'Expected thumbnail candidate condition to have keys :attribute and :value.')
      end

      value = configuration[condition[:attribute].to_s]

      if negated
        value != condition[:value]
      else
        value == condition[:value]
      end
    end

    def find_positioned_file_by_candiate(candidate)
      PositionedFile.wrap(find_file_by_candidate(candidate),
                          file_position(candidate, :x),
                          file_position(candidate, :y))
    end

    def find_file_by_candidate(candidate)
      entry.find_file_by_perma_id(file_model(candidate), record_id(candidate))
    end

    def file_model(candidate)
      file_type(candidate).model
    end

    def file_type(candidate)
      Pageflow.config.file_types.find_by_collection_name!(candidate.fetch(:file_collection))
    end

    def record_id(candidate)
      configuration[candidate.fetch(:attribute)]
    end

    def file_position(candidate, coordinate)
      configuration[file_position_attribute(candidate, coordinate)]
    end

    def file_position_attribute(candidate, coordinate)
      candidate.fetch(:attribute).gsub(/_id$/, "_#{coordinate}")
    end
  end
end
