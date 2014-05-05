module Pageflow
  class ZencoderOutputDefinition
    cattr_accessor :default_output_bucket_name, :default_sftp_host

    attr_accessor :options

    def initialize(options)
      @options = options
    end

    def input_s3_url
      raise "Not implemented"
    end

    def outputs
      raise "Not implemented"
    end

    def ==(other)
      other.class == self.class &&
        other.input_s3_url == input_s3_url &&
        other.outputs == outputs
    end
    alias_method :eql?, :==

      protected

    def s3_and_transfer(definition)
      [s3_definition(definition), transfer_definition(definition)].compact
    end

    def s3_and_sftp(definition)
      [s3_definition(definition), sftp_definition(definition)].compact
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

    private

    def transfer_definition(definition)
      return unless sftp_configured?
      {
        :label => "transfer_#{definition[:label]}",
        :source => definition[:label],
        :type => 'transfer-only',
        :url => sftp_url(definition[:path])
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
  end
end
