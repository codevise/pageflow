require 'spec_helper'

module Pageflow
  describe EntriesHelper do
    before(:each) do
      helper.extend(Pageflow::Engine.routes.url_helpers)
    end

    describe '#pretty_entry_title' do
      it 'equals the entry title by default' do
        entry = PublishedEntry.new(build(:entry, title: 'test'), build(:revision))
        expect(helper.pretty_entry_title(entry)).to eq('test')
      end

      it 'includes the cname domain when present' do
        theming = build(:theming, cname: 'www.example.com')
        entry = PublishedEntry.new(build(:entry, title: 'test', theming: theming), build(:revision))
        expect(helper.pretty_entry_title(entry)).to eq('test - example.com')
      end

      it 'does not include empty cname domain' do
        theming = build(:theming, cname: '')
        entry = PublishedEntry.new(build(:entry, title: 'test', theming: theming), build(:revision))
        expect(helper.pretty_entry_title(entry)).to eq('test')
      end
    end

    describe '#pretty_entry_url' do
      it 'uses default host' do
        theming = create(:theming, cname: '')
        entry = PublishedEntry.new(create(:entry, title: 'test', theming: theming),
                                   create(:revision))

        expect(helper.pretty_entry_url(entry)).to eq('http://test.host/test')
      end

      it 'supports custom params' do
        theming = create(:theming, cname: '')
        entry = PublishedEntry.new(create(:entry, title: 'test', theming: theming),
                                   create(:revision))

        expect(helper.pretty_entry_url(entry, page: 4)).to eq('http://test.host/test?page=4')
      end

      it 'uses theming cname if present' do
        theming = create(:theming, cname: 'my.example.com')
        entry = PublishedEntry.new(create(:entry, title: 'test', theming: theming),
                                   create(:revision))

        expect(helper.pretty_entry_url(entry)).to eq('http://my.example.com/test')
      end

      it 'can be configured via hash in public_entry_url_options' do
        Pageflow.config.public_entry_url_options = {host: 'public.example.com'}
        entry = PublishedEntry.new(create(:entry, title: 'test'),
                                   create(:revision))

        expect(helper.pretty_entry_url(entry)).to eq('http://public.example.com/test')
      end

      it 'can be configured via lambda in public_entry_url_options' do
        Pageflow.config.public_entry_url_options = lambda { |theming| {host: "#{theming.account.name}.example.com" } }
        account = create(:account, name: 'myaccount')
        entry = PublishedEntry.new(create(:entry, title: 'test', account: account),
                                   create(:revision))

        expect(helper.pretty_entry_url(entry)).to eq('http://myaccount.example.com/test')
      end
    end

    describe '#entry_privacy_link_url' do
      it 'uses configured url and locale' do
        theming = create(:theming,
                         privacy_link_url: 'https://example.com/privacy')
        entry = PublishedEntry.new(create(:entry,
                                          :published,
                                          theming: theming,
                                          published_revision_attributes: {
                                            locale: 'de'
                                          }))

        result = helper.entry_privacy_link_url(entry)

        expect(result).to eq('https://example.com/privacy?lang=de')
      end

      it 'returns nil if no url is configured' do
        entry = PublishedEntry.new(create(:entry,
                                          :published,
                                          published_revision_attributes: {
                                            locale: 'de'
                                          }))
        result = helper.entry_privacy_link_url(entry)

        expect(result).to be_nil
      end
    end

    describe '#entry_file_rights' do
      it 'returns comma separated list of file rights' do
        revision = create(:revision)
        image_file = create(:image_file, rights: 'My Company', used_in: revision)
        image_file = create(:image_file, rights: 'My Photographer', used_in: revision)
        entry = PublishedEntry.new(create(:entry), revision)

        result = helper.entry_file_rights(entry)

        expect(result).to include(': My Company, My Photographer')
      end

      it 'falls back to default file rights' do
        revision = create(:revision)
        image_file = create(:image_file, used_in: revision)
        account = create(:account, default_file_rights: 'My Account')
        entry = PublishedEntry.new(create(:entry, account: account), revision)

        result = helper.entry_file_rights(entry)

        expect(result).to include(': My Account')
      end

      it 'does not insert extra comma if a file has no rights and defaults are not configured' do
        revision = create(:revision)
        image_file = create(:image_file, used_in: revision)
        image_file = create(:image_file, rights: 'My Photographer', used_in: revision)
        entry = PublishedEntry.new(create(:entry), revision)

        result = helper.entry_file_rights(entry)

        expect(result).to include(': My Photographer')
      end

      it 'returns empty string if no rights are defined' do
        revision = create(:revision)
        image_file = create(:image_file, used_in: revision)
        entry = PublishedEntry.new(create(:entry), revision)

        result = helper.entry_file_rights(entry)

        expect(result).to eq('')
      end
    end

    describe '#entry_stylesheet_link_tag' do
      it 'renders stylesheet link tag' do
        revision = build_stubbed(:revision)
        entry = PublishedEntry.new(build_stubbed(:entry), revision)

        result = helper.entry_stylesheet_link_tag(entry)

        expect(result).to have_selector('link[rel=stylesheet][media=all]', visible: false)
      end

      it 'sets data-name attribute' do
        revision = build_stubbed(:revision)
        entry = PublishedEntry.new(build_stubbed(:entry), revision)

        result = helper.entry_stylesheet_link_tag(entry)

        expect(result).to have_selector('link[data-name=entry]', visible: false)
      end

      it 'does not use asset_host' do
        revision = build_stubbed(:revision)
        entry = PublishedEntry.new(build_stubbed(:entry), revision)

        controller.config.asset_host = 'some-asset-host'
        result = helper.entry_stylesheet_link_tag(entry)

        expect(result).not_to include('some-asset-host')
      end

      it 'returns revision css for published entry with custom revision' do
        revision = build_stubbed(:revision)
        entry = PublishedEntry.new(build_stubbed(:entry), revision)

        result = helper.entry_stylesheet_link_tag(entry)

        expect(result).to include(%(href="/revisions/#{revision.id}/stylesheet.css))
      end

      it 'returns entry css for published entry without custom revision' do
        revision = build_stubbed(:revision, :published)
        entry = PublishedEntry.new(build_stubbed(:entry, published_revision: revision))

        result = helper.entry_stylesheet_link_tag(entry)

        expect(result).to include(%(href="/entries/#{entry.entry.id}/stylesheet.css))
      end

      it 'appends revision cache key for published entry without custom revision' do
        revision = build_stubbed(:revision, :published)
        entry = PublishedEntry.new(build_stubbed(:entry, published_revision: revision))

        result = helper.entry_stylesheet_link_tag(entry)

        expect(result).to include("v=#{ERB::Util.url_encode(revision.cache_key)}")
      end

      it 'appends revision cache key for published entry with custom revision' do
        revision = build_stubbed(:revision, :published)
        entry = PublishedEntry.new(build_stubbed(:entry), revision)

        result = helper.entry_stylesheet_link_tag(entry)

        expect(result).to include("v=#{ERB::Util.url_encode(revision.cache_key)}")
      end

      it 'appends revision cache key for draft entry' do
        revision = build_stubbed(:revision)
        entry = DraftEntry.new(build_stubbed(:entry, draft: revision))

        result = helper.entry_stylesheet_link_tag(entry)

        expect(result).to include("v=#{ERB::Util.url_encode(revision.cache_key)}")
      end

      it 'appends pageflow version' do
        revision = build_stubbed(:revision)
        entry = DraftEntry.new(build_stubbed(:entry, draft: revision))

        result = helper.entry_stylesheet_link_tag(entry)

        expect(result).to include("p=#{Pageflow::VERSION}")
      end
    end

    describe '#entry_global_links' do
      it 'does not output links by default' do
        theming = create(:theming)
        entry = PublishedEntry.new(create(:entry, theming: theming))

        result = helper.entry_global_links(entry)

        expect(result).not_to have_selector('a')
      end

      it 'includes imprint link if configured' do
        theming = create(:theming,
                         imprint_link_label: 'Imprint',
                         imprint_link_url: 'https://example.com/legal')
        entry = PublishedEntry.new(create(:entry, theming: theming))

        result = helper.entry_global_links(entry)

        expect(result).to have_selector('a[href="https://example.com/legal"]',
                                        text: 'Imprint')
      end

      it 'includes copyright link if configured' do
        theming = create(:theming,
                         copyright_link_label: 'Copyright',
                         copyright_link_url: 'https://example.com/copyright')
        entry = PublishedEntry.new(create(:entry, theming: theming))

        result = helper.entry_global_links(entry)

        expect(result).to have_selector('a[href="https://example.com/copyright"]',
                                        text: 'Copyright')
      end

      it 'includes privacy link if configured' do
        theming = create(:theming,
                         privacy_link_url: 'https://example.com/privacy')
        entry = PublishedEntry.new(create(:entry,
                                          :published,
                                          theming: theming,
                                          published_revision_attributes: {
                                            locale: 'de'
                                          }))

        result = helper.entry_global_links(entry)

        expect(result).to have_selector('a[href="https://example.com/privacy?lang=de"]')
      end
    end
  end
end
