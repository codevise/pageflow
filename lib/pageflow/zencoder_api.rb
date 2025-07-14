module Pageflow
  class ZencoderApi
    class Error < StandardError; end
    class RecoverableError < Error; end
    class UnrecoverableError < Error; end

    def create_job(definition)
      with_exception_translation do
        response = Zencoder::Job.create(input: definition.input_s3_url,
                                        outputs: definition.outputs)
        raise translate_zencoder_errors(response.errors) unless response.success?

        response.body['id']
      end
    end

    def get_info(job_id)
      with_exception_translation do
        response = Zencoder::Job.progress(job_id)

        raise translate_zencoder_errors(response.errors) unless response.success?

        {
          state: response.body['state'],
          progress: response.body['progress'],
          finished: response.body['state'] == 'finished'
        }
      end
    end

    # @deprecated Use `get_details(job_id)` instead.
    def get_input_details(job_id)
      get_details(job_id)
    end

    def get_details(job_id)
      with_exception_translation do
        response = Zencoder::Job.details(job_id)

        raise translate_zencoder_errors(response.errors) unless response.success?

        input_details = response.body['job']['input_media_file']
        outputs_details = response.body['job']['output_media_files']

        output_presences = outputs_details.each_with_object({}) do |output, presences|
          presences[output['label'].to_sym] = output['state'] if output['label'].present?
        end

        {
          format: input_details['format'],
          duration_in_ms: input_details['duration_in_ms'],
          width: input_details['width'],
          height: input_details['height'],
          output_presences:
        }
      end
    end

    def self.instance
      ZencoderApi.new
    end

    private

    def with_exception_translation
      yield
    rescue Timeout::Error
      raise RecoverableError, 'Zencoder timed out.'
    rescue Zencoder::HTTPError => e
      raise RecoverableError, e.message
    end

    def translate_zencoder_errors(errors)
      raise UnrecoverableError, "Zencoder responded with errors:\n#{errors * "\n"}"
    end
  end
end
