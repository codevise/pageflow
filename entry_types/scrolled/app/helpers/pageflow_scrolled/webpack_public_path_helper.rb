module PageflowScrolled
  # @api private
  module WebpackPublicPathHelper
    def scrolled_webpack_public_path_script_tag
      content_tag(:script, WebpackPublicPathHelper.js_snippet.html_safe)
    end

    def self.js_snippet
      asset_host = Rails.configuration.action_controller.asset_host
      packs_dir = Webpacker.config.public_output_path.basename

      "var __webpack_public_path__ = '#{asset_host}/#{packs_dir}/';"
    end
  end
end
