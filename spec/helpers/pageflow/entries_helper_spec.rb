require 'spec_helper'

# TODO
ActionView::TestCase::TestController.send(:include, Pageflow::Engine.routes.url_helpers)

module Pageflow
  describe EntriesHelper do
    describe '#entry_stylesheet_link_tag' do
      it 'returns revision css for published entry with custom revision' do
        revision = build_stubbed(:revision)
        entry = PublishedEntry.new(build_stubbed(:entry), revision)

        expect(helper.entry_stylesheet_link_tag(entry)).to include(%Q'href="/revisions/#{revision.id}.css')
      end

      it 'returns entry css for published entry without custom revision' do
        entry = PublishedEntry.new(build_stubbed(:entry))

        expect(helper.entry_stylesheet_link_tag(entry)).to include(%Q'href="/entries/#{entry.entry.id}.css')
      end
    end
  end
end
