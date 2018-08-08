module Pageflow
  class ZencoderApi
    class Error < StandardError; end
    class RecoverableError < Error; end
    class UnrecoverableError < Error; end

    def create_job(definition)
      with_exception_translation do
        response = Zencoder::Job.create(:input => definition.input_s3_url,
                                        :outputs => definition.outputs)
        if response.success?
          response.body['id']
        else
          raise translate_zencoder_errors(response.errors)
        end
      end
    end

    def get_info(job_id)
      with_exception_translation do
        response = Zencoder::Job.progress(job_id)

        if response.success?
          {
            :state => response.body["state"],
            :progress => response.body["progress"],
            :finished => response.body["state"] == 'finished'
          }
        else
          raise translate_zencoder_errors(response.errors)
        end
      end
    end

    # @deprecated Use `get_details(job_id)` instead.
    def get_input_details(job_id)
      get_details(job_id)
    end

    def get_details(job_id)
      with_exception_translation do
        response = Zencoder::Job.details(job_id)

        if response.success?
          input_details = response.body['job']['input_media_file']
          outputs_details = response.body['job']['output_media_files']

          output_presences = outputs_details.inject({}) do |presences, output|
            if output['label'].present?
              presences[output['label'].to_sym] = output['state']
            end
            presences
          end

          {
            format: input_details['format'],
            duration_in_ms: input_details['duration_in_ms'],
            width: input_details['width'],
            height: input_details['height'],
            output_presences: output_presences
          }
        else
          raise translate_zencoder_errors(response.errors)
        end
      end
    end

    def self.instance
      ZencoderApi.new
    end

    private

    def with_exception_translation
      begin
        yield
      rescue Timeout::Error
        raise RecoverableError, 'Zencoder timed out.'
      rescue Zencoder::HTTPError => e
        raise RecoverableError, e.message
      end
    end

    def translate_zencoder_errors(errors)
      raise UnrecoverableError, "Zencoder responded with errors:\n#{errors * "\n"}"
    end
  end
end
