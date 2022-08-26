require 'spec_helper'

module PageflowScrolled
  RSpec.describe 'WebAppManifest' do
    it 'includes links to theme customization file favicons' do
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

      result = WebAppManifest.call(entry)

      expect(result)
        .to include_json(icons: [
                           {
                             src: %r{w192/image.png},
                             type: 'image/png',
                             sizes: '192x192'
                           },
                           {
                             src: %r{w512/image.png},
                             type: 'image/png',
                             sizes: '512x512'
                           }
                         ])
    end

    it 'falls back to theme asset favicons' do
      entry = create(:published_entry, type_name: 'scrolled')

      result = WebAppManifest.call(entry)

      expect(result)
        .to include_json(icons: [
                           {
                             src: %r{favicons/android-chrome-192x192-.*\.png},
                             type: 'image/png',
                             sizes: '192x192'
                           },
                           {
                             src: %r{favicons/android-chrome-512x512-.*\.png},
                             type: 'image/png',
                             sizes: '512x512'
                           }
                         ])
    end
  end
end
