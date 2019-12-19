require 'spec_helper'

require 'pageflow/matchers/have_json_ld'

module Pageflow
  describe PageBackgroundAssetHelper do
    include UsedFileTestHelper

    describe '#page_background_asset' do
      it 'renders background image div' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file = create_used_file(:image_file, entry: entry)
        page = create(:page,
                      revision: entry.revision,
                      configuration: {background_image_id: image_file.perma_id})

        html = helper.page_background_asset(page)

        expect(html).to have_selector("div.background_image.image_#{image_file.perma_id}")
      end

      it 'renders structured data for background image' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file = create_used_file(:image_file, entry: entry)
        page = create(:page,
                      revision: entry.revision,
                      configuration: {background_image_id: image_file.perma_id})

        html = helper.page_background_asset(page)

        expect(html).to have_json_ld('@type' => 'ImageObject')
      end

      it 'renders structured data for background vodep' do
        entry = PublishedEntry.new(create(:entry, :published))
        video_file = create_used_file(:video_file, entry: entry)
        page = create(:page,
                      revision: entry.revision,
                      configuration: {
                        background_type: 'video',
                        video_file_id: video_file.perma_id
                      })

        html = helper.page_background_asset(page)

        expect(html).to have_json_ld('@type' => 'VideoObject')
      end

      it 'does not render structured data if feature is disabled' do
        entry = PublishedEntry.new(create(:entry, :published, without_feature: 'structured_data'))
        image_file = create_used_file(:image_file, entry: entry)
        page = create(:page,
                      revision: entry.revision,
                      configuration: {background_image_id: image_file.perma_id})

        html = helper.page_background_asset(page)

        expect(html).not_to have_json_ld('@type' => 'ImageObject')
      end
    end
  end
end
