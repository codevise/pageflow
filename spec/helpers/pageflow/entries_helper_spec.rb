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

    describe '#entry_stylesheet_link_tag' do
      it 'returns revision css for published entry with custom revision' do
        revision = build_stubbed(:revision)
        entry = PublishedEntry.new(build_stubbed(:entry), revision)

        expect(helper.entry_stylesheet_link_tag(entry)).to include(%Q'href="/revisions/#{revision.id}.css')
      end

      it 'returns entry css for published entry without custom revision' do
        revision = build_stubbed(:revision, :published)
        entry = PublishedEntry.new(build_stubbed(:entry, published_revision: revision))

        expect(helper.entry_stylesheet_link_tag(entry)).to include(%Q'href="/entries/#{entry.entry.id}.css')
      end

      it 'appends revision cache key for published entry without custom revision' do
        revision = build_stubbed(:revision, :published)
        entry = PublishedEntry.new(build_stubbed(:entry, published_revision: revision))

        expect(helper.entry_stylesheet_link_tag(entry)).to include(%Q'href="/entries/#{entry.entry.id}.css?v=#{ERB::Util.url_encode(revision.cache_key)}')
      end

      it 'appends revision cache key for published entry with custom revision' do
        revision = build_stubbed(:revision, :published)
        entry = PublishedEntry.new(build_stubbed(:entry), revision)

        expect(helper.entry_stylesheet_link_tag(entry)).to include(%Q'href="/revisions/#{revision.id}.css?v=#{ERB::Util.url_encode(revision.cache_key)}')
      end

      it 'appends revision cache key for draft entry' do
        revision = build_stubbed(:revision)
        entry = DraftEntry.new(build_stubbed(:entry, draft: revision))

        expect(helper.entry_stylesheet_link_tag(entry)).to include(%Q'href="/revisions/#{revision.id}.css?v=#{ERB::Util.url_encode(revision.cache_key)}')
      end
    end
  end
end
