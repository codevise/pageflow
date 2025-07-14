module Pageflow
  class ZencoderOutputDefinition
    cattr_accessor :default_output_bucket_name, :default_sftp_host, :default_akamai_host,
                   :default_akamai_credentials

    attr_accessor :options

    def initialize(options)
      @options = options
    end

    def input_s3_url
      raise 'Not implemented'
    end

    def outputs
      raise 'Not implemented'
    end

    def ==(other)
      other.class == self.class &&
        other.input_s3_url == input_s3_url &&
        other.outputs == outputs
    end
    alias eql? ==

    protected

    def transferable(definition)
      if akamai_configured?
        akamai_definition(definition)
      else
        [s3_definition(definition), sftp_transfer_definition(definition)].compact
      end
    end

    def non_transferable(definition)
      if akamai_configured?
        akamai_definition(definition)
      else
        [s3_definition(definition), sftp_definition(definition)].compact
      end
    end

    def with_credentials(definition)
      definition[:credentials] = akamai_credentials if akamai_configured?

      definition
    end

    def s3_url(path)
      "s3://#{File.join(output_bucket_name, path)}"
    end

    def output_bucket_name
      options.fetch(:output_bucket_name, default_output_bucket_name)
    end

    def sftp_url(path)
      "#{File.join(sftp_host, path)}"
    end

    def sftp_host
      options.fetch(:sftp_host, default_sftp_host)
    end

    def sftp_configured?
      sftp_host.present?
    end

    def akamai_url(path)
      "#{File.join(akamai_host, path)}"
    end

    def akamai_host
      options.fetch(:akamai_host, default_akamai_host)
    end

    def akamai_credentials
      options.fetch(:akamai_credentials, default_akamai_credentials)
    end

    def akamai_configured?
      akamai_host.present? && akamai_credentials.present?
    end

    private

    def sftp_transfer_definition(definition)
      return unless sftp_configured?

      {
        label: "sftp_transfer_#{definition[:label]}",
        source: definition[:label],
        type: 'transfer-only',
        url: sftp_url(definition[:path])
      }
    end

    def s3_definition(source_defintion)
      source_defintion.dup.tap do |definiton|
        definiton[:url] = s3_url(definiton.delete(:path))
      end
    end

    def sftp_definition(source_defintion)
      return unless sftp_configured?

      source_defintion.dup.tap do |definiton|
        definiton[:label] = "sftp_#{definiton[:label]}"
        definiton[:url] = sftp_url(definiton.delete(:path))
      end
    end

    def akamai_definition(source_defintion)
      source_defintion.dup.tap do |definiton|
        definiton[:url] = akamai_url(definiton.delete(:path))
        definiton[:credentials] = akamai_credentials
      end
    end
  end
end
