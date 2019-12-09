require 'spec_helper'

module Pageflow
  describe Editor::EntriesHelper do
    describe 'editor_entry_type_fragment' do
      it 'renders entry type specific partial' do
        renderer = double('renderer')
        pageflow_configure do |config|
          TestEntryType.register(config,
                                 name: 'test',
                                 editor_fragment_renderer: renderer)
        end
        entry = create(:entry, type_name: 'test')

        allow(renderer)
          .to receive(:head_fragment).and_return('<script src="/test_entry_type/editor.js">')

        result = helper.editor_entry_type_fragment(entry, :head)

        expect(renderer).to have_received(:head_fragment).with(entry)
        expect(result).to have_selector('script[src^="/test_entry_type/editor.js"]',
                                        visible: false)
      end
    end
  end
end
