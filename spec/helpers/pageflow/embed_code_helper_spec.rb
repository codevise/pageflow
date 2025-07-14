require 'spec_helper'

module Pageflow
  describe EmbedCodeHelper do
    describe '#embed_code_entry_snippet' do
      it 'returns HTML code for an iframe' do
        entry = create(:entry)
        snippet = helper.embed_code_entry_snippet(entry)

        result = snippet.call

        expect(result).to have_selector('iframe')
      end

      it 'uses https protocol by default' do
        entry = create(:entry, title: 'my-entry')
        snippet = helper.embed_code_entry_snippet(entry)

        result = snippet.call

        expected_url = 'https://test.host/my-entry/embed'
        expect(result).to have_selector("iframe[src='#{expected_url}']")
      end

      it 'uses entry_embed_url_options supplied as hash' do
        Pageflow.config.entry_embed_url_options = {host: 'some.example.com'}
        entry = create(:entry, title: 'my-entry')
        snippet = helper.embed_code_entry_snippet(entry)

        result = snippet.call

        expected_domain = 'http://some.example.com/my-entry/embed'
        expect(result).to have_selector("iframe[src='#{expected_domain}']")
      end

      it 'uses entry_embed_url_options supplied as lambda' do
        Pageflow.config.entry_embed_url_options = ->(site) { {host: site.cname} }
        site = create(:site, cname: 'example.com')
        entry = create(:entry, site:, title: 'my-entry')
        snippet = helper.embed_code_entry_snippet(entry)

        result = snippet.call

        expected_domain = 'http://example.com/my-entry/embed'
        expect(result).to have_selector("iframe[src*='#{expected_domain}']")
      end
    end
  end
end
