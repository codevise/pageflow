require 'spec_helper'

module PageflowScrolled
  RSpec.describe FaviconHelper, type: :helper do
    describe '#scrolled_favicons_for_entry' do
      it 'renders link to favicon theme customization file' do
        entry = create(:published_entry, type_name: 'scrolled')
        file = Pageflow.theme_customizations.upload_file(
          account: entry.account,
          entry_type_name: 'scrolled',
          type_name: :favicon,
          attachment: fixture_file_upload('image.svg')
        )
        Pageflow.theme_customizations.update(account: entry.account,
                                             entry_type_name: 'scrolled',
                                             file_ids: {favicon: file.id})

        html = helper.scrolled_favicons_for_entry(entry)

        expect(html)
          .to have_selector('link[rel="icon"][type="image/svg+xml"]' \
                            '[href*="original/image.svg"]',
                            visible: false)
      end

      it 'falls back to favicon_png theme customization file' do
        entry = create(:published_entry, type_name: 'scrolled')
        file = Pageflow.theme_customizations.upload_file(
          account: entry.account,
          entry_type_name: 'scrolled',
          type_name: :favicon_png,
          attachment: fixture_file_upload('image.jpg')
        )
        Pageflow.theme_customizations.update(account: entry.account,
                                             entry_type_name: 'scrolled',
                                             file_ids: {favicon_png: file.id})

        html = helper.scrolled_favicons_for_entry(entry)

        expect(html)
          .to have_selector('link[rel="icon"][type="image/png"][sizes="32x32"]' \
                            '[href*="w32/image.png"]',
                            visible: false)
        expect(html)
          .to have_selector('link[rel="icon"][type="image/png"][sizes="16x16"]' \
                            '[href*="w16/image.png"]',
                            visible: false)
      end

      it 'falls back to theme asset' do
        entry = create(:published_entry, type_name: 'scrolled')

        html = helper.scrolled_favicons_for_entry(entry)

        expect(html)
          .to have_selector('link[rel="icon"][type="image/png"][sizes="32x32"]' \
                            '[href*="default/favicons/favicon-32x32"]' \
                            '[href$=".png"]',
                            visible: false)
        expect(html)
          .to have_selector('link[rel="icon"][type="image/png"][sizes="16x16"]' \
                            '[href*="default/favicons/favicon-16x16"]' \
                            '[href$=".png"]',
                            visible: false)
      end

      it 'uses favicon_png theme customization file for apple touch icon' do
        entry = create(:published_entry, type_name: 'scrolled')
        file = Pageflow.theme_customizations.upload_file(
          account: entry.account,
          entry_type_name: 'scrolled',
          type_name: :favicon_png,
          attachment: fixture_file_upload('image.jpg')
        )
        Pageflow.theme_customizations.update(account: entry.account,
                                             entry_type_name: 'scrolled',
                                             file_ids: {favicon_png: file.id})

        html = helper.scrolled_favicons_for_entry(entry)

        expect(html)
          .to have_selector('link[rel="apple-touch-icon"][href*="w180/image.png"]',
                            visible: false)
      end

      it 'falls back to theme asset for apple touch icon' do
        entry = create(:published_entry, type_name: 'scrolled')

        html = helper.scrolled_favicons_for_entry(entry)

        expect(html)
          .to have_selector('link[rel="apple-touch-icon"]' \
                            '[href*="default/favicons/apple-touch-icon"]' \
                            '[href$=".png"]',
                            visible: false)
      end

      it 'renders link to favicon_ico theme customization file' do
        entry = create(:published_entry, type_name: 'scrolled')
        file = Pageflow.theme_customizations.upload_file(
          account: entry.account,
          entry_type_name: 'scrolled',
          type_name: :favicon_ico,
          attachment: fixture_file_upload('image.ico')
        )
        Pageflow.theme_customizations.update(account: entry.account,
                                             entry_type_name: 'scrolled',
                                             file_ids: {favicon_ico: file.id})

        html = helper.scrolled_favicons_for_entry(entry)

        expect(html)
          .to have_selector('link[rel="icon"][sizes="any"]' \
                            '[href*="original/image.ico"]',
                            visible: false)
      end

      it 'falls back to theme asset for ico favicon' do
        entry = create(:published_entry, type_name: 'scrolled')

        html = helper.scrolled_favicons_for_entry(entry)

        expect(html)
          .to have_selector('link[rel="icon"][sizes="any"]' \
                            '[href*="default/favicons/favicon"]' \
                            '[href$=".ico"]',
                            visible: false)
      end

      it 'renders link to web app manifest' do
        entry = create(:published_entry,
                       title: 'My Entry',
                       type_name: 'scrolled')

        html = helper.scrolled_favicons_for_entry(entry)

        expect(html)
          .to have_selector('link[rel="manifest"]' \
                            '[href*="/my-entry/manifest.webmanifest"]',
                            visible: false)
      end

      it 'renders theme color meta tag' do
        entry = create(:published_entry, type_name: 'scrolled')

        html = helper.scrolled_favicons_for_entry(entry)

        expect(html)
          .to have_selector('meta[name="theme-color"]',
                            visible: false)
      end
    end
  end
end
