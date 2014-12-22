module Pageflow
  class ThumbnailFileResolver < Struct.new(:candidates, :configuration)
    def find
      candidates.reduce(nil) do |result, candidate|
        result || find_positioned_file_by_candiate(candidate)
      end || PositionedFile.null
    end

    private

    def find_positioned_file_by_candiate(candidate)
      PositionedFile.wrap(find_file_by_candidate(candidate),
                          file_position(candidate, :x),
                          file_position(candidate, :y))
    end

    def find_file_by_candidate(candidate)
      file_model(candidate).find_by_id(record_id(candidate))
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
