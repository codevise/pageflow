require 'spec_helper'

module Pageflow
  describe AssetUrlsHelper do
    describe '#editor_asset_urls' do
      it 'returns image urls' do
        json = JSON.parse(helper.editor_asset_urls)

        expect(json['help']['phone_horizontal_slideshow_mode']).to be_present
      end
    end
  end
end
