module Pageflow
  class ThumbnailFileResolver < Struct.new(:candidates, :configuration)
    class Null
      def thumbnail_url(*args)
        ImageFile.new.processed_attachment.url(*args)
      end

      def blank?
        true
      end
    end

    def find
      candidates.reduce(nil) do |result, candidate|
        result || file_model(candidate).find_by_id(record_id(candidate))
      end || Null.new
    end

    private

    def file_model(candidate)
      file_type(candidate).model
    end

    def file_type(candidate)
      Pageflow.config.file_types.find_by_collection_name!(candidate.fetch(:file_collection))
    end

    def record_id(candidate)
      configuration[candidate.fetch(:attribute)]
    end
  end
end
