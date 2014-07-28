module Pageflow
  class ZencoderAttachment

    cattr_accessor :default_options
    self.default_options = {
      path: "/:zencoder_asset_version/:host/:class/:id_partition/:filename",
      url: ":zencoder_protocol://:zencoder_host_alias:zencoder_path",
      hls_url: ":zencoder_protocol://:zencoder_hls_host_alias:zencoder_path",
      hls_origin_url: ":zencoder_protocol://:zencoder_hls_origin_host_alias:zencoder_path"
    }

    attr_reader :file_name_pattern, :instance, :options, :styles

    def initialize(instance, file_name_pattern, options = {})
      @instance = instance
      @file_name_pattern = file_name_pattern
      @options = options.merge(default_options)

      @styles = {}
    end

    def format
      options[:format]
    end

    def dir_name
      File.dirname(path)
    end

    def base_name_pattern
      File.basename(file_name_pattern)
    end

    def original_filename
      [file_name_pattern.gsub('{{number}}', '0'), options[:format]].compact * '.'
    end

    def path
      Paperclip::Interpolations.interpolate(options[:path], self, 'default')
    end

    def url(url_options = {})
      base_url =
        case (url_options[:host] || options[:host])
        when :hls
          options[:hls_url]
        when :hls_origin
          options[:hls_origin_url]
        else
          options[:url]
        end

      Paperclip::Interpolations.interpolate(base_url + suffix(url_options), self, 'default')
    end

    private

    def suffix(url_options)
      [
        options[:url_suffix],
        url_options[:unique_id] ? "?n=#{url_options[:unique_id]}" : nil
      ].compact.join
    end
  end
end
