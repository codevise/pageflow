module PageflowScrolled
  # @api private
  module WebpackPublicPathHelper
    def scrolled_webpack_public_path_script_tag
      content_tag(:script, WebpackPublicPathHelper.js_snippet(request).html_safe)
    end

    def self.js_snippet(request = nil)
      config_host = Rails.configuration.action_controller.asset_host
      packs_dir = Webpacker.config.public_output_path.basename
      asset_host = if config_host.respond_to?(:call)
                     config_host.call(packs_dir, request)
                   else
                     config_host
                   end

      "var __webpack_public_path__ = '#{asset_host}/#{packs_dir}/';"
    end
  end
end
