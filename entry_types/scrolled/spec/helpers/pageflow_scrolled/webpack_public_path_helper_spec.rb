require 'spec_helper'

module PageflowScrolled
  RSpec.describe WebpackPublicPathHelper, type: :helper do
    describe 'scrolled_webpack_public_path_script_tag' do
      it 'sets global variable' do
        html = helper.scrolled_webpack_public_path_script_tag

        expect(html)
          .to have_selector('script',
                            visible: false,
                            text: "var __webpack_public_path__ = '/packs-test/';")
      end

      it 'can deal with proc asset host' do
        allow(Rails.configuration.action_controller).to receive(:asset_host)
          .and_return(lambda do |source, request = nil, *_|
                        "2#{source}" if request && source
                      end)

        html = helper.scrolled_webpack_public_path_script_tag

        expect(html)
          .to have_selector(
            'script',
            visible: false,
            text: "var __webpack_public_path__ = '2packs-test/packs-test/';"
          )
      end
    end
  end
end
