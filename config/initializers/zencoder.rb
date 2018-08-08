require 'zencoder'

Pageflow.after_global_configure do |config|
  zencoder_options = config.zencoder_options
  zencoder_options.reverse_merge!(:attachments_version => 'v1')

  Zencoder.api_key = zencoder_options.fetch(:api_key) { raise "Missing api_key option in Pageflow.config.zencoder_options." }

  Pageflow::ZencoderOutputDefinition.default_output_bucket_name = zencoder_options.fetch(:output_bucket) { raise "Missing output_bucket option in Pageflow.config.zencoder_options." }
  Pageflow::ZencoderOutputDefinition.default_sftp_host = zencoder_options[:sftp_host]
  Pageflow::ZencoderOutputDefinition.default_akamai_host = zencoder_options[:akamai_host]
  Pageflow::ZencoderOutputDefinition.default_akamai_credentials = zencoder_options[:akamai_credentials]
  Pageflow::ZencoderVideoOutputDefinition.skip_hls = zencoder_options.fetch(:skip_hls, false)
  Pageflow::ZencoderVideoOutputDefinition.skip_smil = zencoder_options.fetch(:skip_smil, false)

  raise "Missing s3_host_alias option in Pageflow.config.zencoder_options." unless zencoder_options.has_key?(:s3_host_alias)
  raise "Missing s3_protocol option in Pageflow.config.zencoder_options." unless zencoder_options.has_key?(:s3_protocol)

  Pageflow::ZencoderAttachment.default_options.merge!(zencoder_options.slice(:path, :url, :hls_url, :hls_origin_url))
end

Paperclip.interpolates(:zencoder_host_alias) do |attachment, style|
  Pageflow.config.zencoder_options.fetch(:s3_host_alias)
end

Paperclip.interpolates(:zencoder_hls_host_alias) do |attachment, style|
  Pageflow.config.zencoder_options[:hls_host_alias] ||
    Pageflow.config.zencoder_options.fetch(:s3_host_alias)
end

Paperclip.interpolates(:zencoder_hls_origin_host_alias) do |attachment, style|
  Pageflow.config.zencoder_options[:hls_origin_host_alias] ||
    Pageflow.config.zencoder_options.fetch(:s3_host_alias)
end

Paperclip.interpolates(:zencoder_protocol) do |attachment, style|
  protocol = Pageflow.config.zencoder_options.fetch(:s3_protocol)
  protocol.empty? ? protocol : "#{protocol}:"
end

Paperclip.interpolates(:zencoder_asset_version) do |attachment, style|
  Pageflow.config.zencoder_options.fetch(:attachments_version)
end

Paperclip.interpolates(:zencoder_path) do |attachment, style|
  attachment.path
end

Paperclip.interpolates(:zencoder_filename) do |attachment, _style|
  attachment.original_filename
end
