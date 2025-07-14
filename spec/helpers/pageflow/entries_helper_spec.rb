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

      it 'includes the site title when present' do
        site = build(:site, title: 'Example Blog', cname: 'www.example.com')
        entry = PublishedEntry.new(build(:entry, title: 'test', site:), build(:revision))
        expect(helper.pretty_entry_title(entry)).to eq('test - Example Blog')
      end

      it 'includes the cname domain when present' do
        site = build(:site, cname: 'www.example.com')
        entry = PublishedEntry.new(build(:entry, title: 'test', site:), build(:revision))
        expect(helper.pretty_entry_title(entry)).to eq('test - example.com')
      end

      it 'supports suppressing cname suffix via site title is single space character' do
        site = build(:site, title: ' ', cname: 'www.example.com')
        entry = PublishedEntry.new(build(:entry, title: 'test', site:), build(:revision))
        expect(helper.pretty_entry_title(entry)).to eq('test')
      end

      it 'does not include empty cname domain' do
        site = build(:site, cname: '')
        entry = PublishedEntry.new(build(:entry, title: 'test', site:), build(:revision))
        expect(helper.pretty_entry_title(entry)).to eq('test')
      end
    end

    describe '#pretty_entry_url' do
      it 'uses default host' do
        site = create(:site, cname: '')
        entry = PublishedEntry.new(create(:entry, title: 'test', site:),
                                   create(:revision))

        expect(helper.pretty_entry_url(entry)).to eq('http://test.host/test')
      end

      it 'supports custom params' do
        site = create(:site, cname: '')
        entry = PublishedEntry.new(create(:entry, title: 'test', site:),
                                   create(:revision))

        expect(helper.pretty_entry_url(entry, page: 4)).to eq('http://test.host/test?page=4')
      end

      it 'uses site cname if present' do
        site = create(:site, cname: 'my.example.com')
        entry = PublishedEntry.new(create(:entry, title: 'test', site:),
                                   create(:revision))

        expect(helper.pretty_entry_url(entry)).to eq('http://my.example.com/test')
      end

      it 'uses permalink if present' do
        site = create(:site,
                      cname: 'my.example.com')
        entry = create(:published_entry,
                       site:,
                       permalink_attributes: {
                         slug: 'custom',
                         directory_path: 'de/'
                       })

        expect(helper.pretty_entry_url(entry)).to eq('http://my.example.com/de/custom')
      end

      it 'uses site canonical entry url prefix if present' do
        site = create(:site,
                      canonical_entry_url_prefix: 'https://example.com/blog/')
        entry = create(:published_entry, title: 'test', site:)

        expect(helper.pretty_entry_url(entry)).to eq('https://example.com/blog/test')
      end

      it 'prefers canonical entry url prefix over cname' do
        site = create(:site,
                      cname: 'my.example.com',
                      canonical_entry_url_prefix: 'https://example.com/blog/')
        entry = create(:published_entry, title: 'test', site:)

        expect(helper.pretty_entry_url(entry)).to eq('https://example.com/blog/test')
      end

      it 'supports interpolating entry locale in canonical entry url prefix' do
        site = create(:site,
                      canonical_entry_url_prefix: 'https://example.com/:locale/blog/')
        entry = create(:published_entry,
                       title: 'test',
                       site:,
                       revision_attributes: {locale: 'fr'})

        expect(helper.pretty_entry_url(entry)).to eq('https://example.com/fr/blog/test')
      end

      it 'supports reading locale from draft entry' do
        site = create(:site,
                      canonical_entry_url_prefix: 'https://example.com/:locale/blog/')
        entry = create(:draft_entry,
                       title: 'test',
                       site:,
                       revision_attributes: {locale: 'fr'})

        expect(helper.pretty_entry_url(entry)).to eq('https://example.com/fr/blog/test')
      end

      it 'uses locale of published revision if entry model is passed' do
        site = create(:site,
                      canonical_entry_url_prefix: 'https://example.com/:locale/blog/')
        entry = create(:entry,
                       :published,
                       title: 'test',
                       site:,
                       published_revision_attributes: {locale: 'fr'})

        expect(helper.pretty_entry_url(entry)).to eq('https://example.com/fr/blog/test')
      end

      it 'falls back to draft locale if unpublished entry is passed' do
        site = create(:site,
                      canonical_entry_url_prefix: 'https://example.com/:locale/blog/')
        entry = create(:entry,
                       title: 'test',
                       site:)
        entry.draft.update(locale: 'fr')

        expect(helper.pretty_entry_url(entry)).to eq('https://example.com/fr/blog/test')
      end

      it 'combines canonical entry url preifx with permalink if present' do
        site = create(:site,
                      canonical_entry_url_prefix: 'https://example.com/blog/')
        entry = create(:published_entry,
                       site:,
                       permalink_attributes: {
                         slug: 'custom',
                         directory_path: 'de/'
                       })

        expect(helper.pretty_entry_url(entry)).to eq('https://example.com/blog/de/custom')
      end

      it 'supports adding trailing slash' do
        site = create(:site,
                      cname: 'my.example.com',
                      trailing_slash_in_canonical_urls: true)
        entry = PublishedEntry.new(create(:entry, title: 'test', site:),
                                   create(:revision))

        expect(helper.pretty_entry_url(entry)).to eq('http://my.example.com/test/')
      end

      it 'supports adding trailing slash to url with custom prefix' do
        site = create(:site,
                      canonical_entry_url_prefix: 'https://example.com/blog/',
                      trailing_slash_in_canonical_urls: true)
        entry = PublishedEntry.new(create(:entry, title: 'test', site:),
                                   create(:revision))

        expect(helper.pretty_entry_url(entry)).to eq('https://example.com/blog/test/')
      end

      it 'can be configured via hash in public_entry_url_options' do
        pageflow_configure do |config|
          config.public_entry_url_options = {host: 'public.example.com'}
        end
        entry = PublishedEntry.new(create(:entry, title: 'test'),
                                   create(:revision))

        expect(helper.pretty_entry_url(entry)).to eq('http://public.example.com/test')
      end

      it 'can be configured via lambda in public_entry_url_options' do
        pageflow_configure do |config|
          config.public_entry_url_options = lambda do |site|
            {host: "#{site.account.name}.example.com"}
          end
        end
        account = create(:account, name: 'myaccount')
        entry = PublishedEntry.new(create(:entry, title: 'test', account:),
                                   create(:revision))

        expect(helper.pretty_entry_url(entry)).to eq('http://myaccount.example.com/test')
      end

      it 'can be configured via hash in site_url_options' do
        pageflow_configure do |config|
          config.site_url_options = {host: 'public.example.com'}
        end
        entry = PublishedEntry.new(create(:entry, title: 'test'),
                                   create(:revision))

        expect(helper.pretty_entry_url(entry)).to eq('http://public.example.com/test')
      end

      it 'can be configured via lambda in site_url_options' do
        pageflow_configure do |config|
          config.site_url_options = lambda do |site|
            {host: "#{site.account.name}.example.com"}
          end
        end
        account = create(:account, name: 'myaccount')
        entry = PublishedEntry.new(create(:entry, title: 'test', account:),
                                   create(:revision))

        expect(helper.pretty_entry_url(entry)).to eq('http://myaccount.example.com/test')
      end

      it 'passes entry to public_entry_url_options lambda if site_url_options present' do
        pageflow_configure do |config|
          config.site_url_options = lambda do |_site|
            raise 'Should not be used in this case'
          end
          config.public_entry_url_options = lambda do |entry|
            {host: "#{entry.site.account.name}.example.com"}
          end
        end
        account = create(:account, name: 'myaccount')
        entry = PublishedEntry.new(create(:entry, title: 'test', account:),
                                   create(:revision))

        expect(helper.pretty_entry_url(entry)).to eq('http://myaccount.example.com/test')
      end

      it 'does not apply public_entry_url_options from feature block by default' do
        pageflow_configure do |config|
          config.site_url_options = lambda do |site|
            {host: "#{site.account.name}.example.com"}
          end

          config.features.register('custom_permalink_param') do |feature_config|
            feature_config.public_entry_url_options = lambda do |entry|
              {host: "#{entry.site.account.name}.example.com", custom: 'param'}
            end
          end
        end
        account = create(:account, name: 'myaccount')
        entry = PublishedEntry.new(create(:entry,
                                          title: 'test',
                                          account:),
                                   create(:revision))

        expect(helper.pretty_entry_url(entry)).to eq('http://myaccount.example.com/test')
      end

      it 'supports wrapping public_entry_url_options in feature block' do
        pageflow_configure do |config|
          config.site_url_options = lambda do |_site|
            raise 'Should not be used in this case'
          end

          config.features.register('custom_permalink_param') do |feature_config|
            feature_config.public_entry_url_options = lambda do |entry|
              {host: "#{entry.site.account.name}.example.com", custom: 'param'}
            end
          end
        end
        account = create(:account, name: 'myaccount')
        entry = PublishedEntry.new(create(:entry,
                                          title: 'test',
                                          account:,
                                          with_feature: 'custom_permalink_param'),
                                   create(:revision))

        expect(helper.pretty_entry_url(entry)).to eq('http://myaccount.example.com/test?custom=param')
      end
    end

    describe '#entry_privacy_link_url' do
      it 'uses configured url and locale' do
        site = create(:site,
                      privacy_link_url: 'https://example.com/privacy')
        entry = PublishedEntry.new(create(:entry,
                                          :published,
                                          site:,
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

      it 'supports javascript scheme' do
        site = create(:site,
                      privacy_link_url: 'javascript:triggerConsentLayer()')
        entry = PublishedEntry.new(create(:entry, :published, site:))

        result = helper.entry_privacy_link_url(entry)

        expect(result).to eq('javascript:triggerConsentLayer()')
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
        entry = PublishedEntry.new(create(:entry, account:), revision)

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
        site = create(:site)
        entry = PublishedEntry.new(create(:entry, site:))

        result = helper.entry_global_links(entry)

        expect(result).not_to have_selector('a')
      end

      it 'includes imprint link if configured' do
        site = create(:site,
                      imprint_link_label: 'Imprint',
                      imprint_link_url: 'https://example.com/legal')
        entry = PublishedEntry.new(create(:entry, site:))

        result = helper.entry_global_links(entry)

        expect(result).to have_selector('a[href="https://example.com/legal"]',
                                        text: 'Imprint')
      end

      it 'includes copyright link if configured' do
        site = create(:site,
                      copyright_link_label: 'Copyright',
                      copyright_link_url: 'https://example.com/copyright')
        entry = PublishedEntry.new(create(:entry, site:))

        result = helper.entry_global_links(entry)

        expect(result).to have_selector('a[href="https://example.com/copyright"]',
                                        text: 'Copyright')
      end

      it 'includes privacy link if configured' do
        site = create(:site,
                      privacy_link_url: 'https://example.com/privacy')
        entry = PublishedEntry.new(create(:entry,
                                          :published,
                                          site:,
                                          published_revision_attributes: {
                                            locale: 'de'
                                          }))

        result = helper.entry_global_links(entry)

        expect(result)
          .to have_selector('a[target="_blank"][href="https://example.com/privacy?lang=de"]')
      end

      it 'supports javascript scheme for privacy link' do
        site = create(:site,
                      privacy_link_url: 'javascript:triggerConsentLayer()')
        entry = PublishedEntry.new(create(:entry, :published, site:))

        result = helper.entry_global_links(entry)

        expect(result)
          .to have_selector('a:not([target])[href="javascript:triggerConsentLayer()"]')
      end
    end
  end
end
