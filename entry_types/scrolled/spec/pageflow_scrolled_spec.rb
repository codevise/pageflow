require 'spec_helper'

RSpec.describe PageflowScrolled do
  it 'has an engine' do
    expect(PageflowScrolled::Engine).not_to be nil
  end

  describe 'font theme file type' do
    it 'accepts woff upload', unstub_paperclip: true do
      entry = create(:published_entry, type_name: 'scrolled')

      file = Pageflow.theme_customizations.upload_file(
        site: entry.site,
        entry_type_name: 'scrolled',
        type_name: :font,
        attachment: fixture_file_upload('font.woff')
      )

      expect(file.attachment_content_type).to eq('font/woff')
      expect(file.urls[:original]).to match(%r{original/font\.woff})
    end

    it 'accepts woff2 upload', unstub_paperclip: true do
      entry = create(:published_entry, type_name: 'scrolled')

      file = Pageflow.theme_customizations.upload_file(
        site: entry.site,
        entry_type_name: 'scrolled',
        type_name: :font,
        attachment: fixture_file_upload('font.woff2')
      )

      expect(file.attachment_content_type).to eq('font/woff2')
      expect(file.urls[:original]).to match(%r{original/font\.woff2})
    end

    it 'does not process uploaded fonts' do
      entry = create(:published_entry, type_name: 'scrolled')

      file = Pageflow.theme_customizations.upload_file(
        site: entry.site,
        entry_type_name: 'scrolled',
        type_name: :font,
        attachment: fixture_file_upload('font.woff2')
      )

      expect(file.attachment_styles).to be_empty
    end

    it 'rejects uploads that are not fonts', unstub_paperclip: true do
      entry = create(:published_entry, type_name: 'scrolled')

      expect {
        Pageflow.theme_customizations.upload_file(
          site: entry.site,
          entry_type_name: 'scrolled',
          type_name: :font,
          attachment: fixture_file_upload('image.svg')
        )
      }.to raise_error(ActiveRecord::RecordInvalid)
    end
  end
end
