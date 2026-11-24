# Chrome 158 rejects the '*' origin Capybara passes to
# Storage.clearDataForOrigin in ChromeDriver#reset!, which makes every
# js spec fail in its after hook.
#
# Can be removed once the following PR has been released:
# https://github.com/teamcapybara/capybara/pull/2868
module Pageflow
  module ChromeResetPatch
    def reset!
      @origin_before_reset = current_origin_for_reset if @browser
      super
    end

    private

    def execute_cdp(cmd, params = {})
      super
    rescue Selenium::WebDriver::Error::InvalidArgumentError
      raise unless cmd == 'Storage.clearDataForOrigin' && params[:origin] == '*'

      super('Network.clearBrowserCookies')
      return unless @origin_before_reset && clear_all_storage?

      super('Storage.clearDataForOrigin',
            origin: @origin_before_reset,
            storageTypes: 'local_storage')
    end

    def current_origin_for_reset
      origin = Addressable::URI.parse(current_url)&.origin
      origin if origin&.start_with?('http')
    rescue Selenium::WebDriver::Error::WebDriverError
      nil
    end
  end
end

Capybara::Selenium::Driver::ChromeDriver.prepend(Pageflow::ChromeResetPatch)
