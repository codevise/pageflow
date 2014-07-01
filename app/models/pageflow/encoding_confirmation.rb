module Pageflow
  class EncodingConfirmation
    class QuotaExceededError < RuntimeError
    end

    attr_reader :entry, :attributes, :encoding_quota

    def initialize(entry, attributes, encoding_quota)
      @entry = entry
      @attributes = attributes
      @encoding_quota = encoding_quota
    end

    def exceeding?
      assumed_quota.exceeded?
    end

    def save!
      raise(QuotaExceededError) if exceeding?

      files.each do |file|
        file.confirm_encoding!
      end
    end

    def assumed_quota
      @assumed_quota ||= encoding_quota.assume(files: files)
    end

    def files
      @files ||=
        entry.video_files.find(attributes.fetch(:video_file_ids, [])) +
        entry.audio_files.find(attributes.fetch(:audio_file_ids, []))
    end
  end
end
