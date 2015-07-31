require 'spec_helper'

# TODO
ActionView::TestCase::TestController.send(:include, Pageflow::Engine.routes.url_helpers)

module Pageflow
  describe EntriesHelper do
    describe '#pretty_entry_url' do
      it 'uses default host' do
        theming = create(:theming, cname: '')
        entry = PublishedEntry.new(create(:entry, title: 'test', theming: theming),
                                   create(:revision))

        expect(helper.pretty_entry_url(entry)).to eq('http://test.host/test')
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
      it 'returns revision css for published entry with custom revision' do
        revision = build_stubbed(:revision)
        entry = PublishedEntry.new(build_stubbed(:entry), revision)

        result = helper.entry_stylesheet_link_tag(entry)

        expect(result).to include(%Q'href="/revisions/#{revision.id}.css')
      end

      it 'returns entry css for published entry without custom revision' do
        revision = build_stubbed(:revision, :published)
        entry = PublishedEntry.new(build_stubbed(:entry, published_revision: revision))

        result = helper.entry_stylesheet_link_tag(entry)

        expect(result).to include(%Q'href="/entries/#{entry.entry.id}.css')
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
  end
end
