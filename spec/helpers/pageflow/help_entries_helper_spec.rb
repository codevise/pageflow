require 'spec_helper'

module Pageflow
  describe HelpEntriesHelper do
    describe '#help_entry_sections' do
      it 'renders sections for registered help entries' do
        config = Configuration.new
        config.help_entries.register('some')

        html = help_entry_sections(config)

        expect(html).to have_selector('section[data-name="some"]')
      end

      it 'renders nested sections' do
        config = Configuration.new
        config.help_entries.register('parent')
        config.help_entries.register('child', parent: 'parent')

        html = help_entry_sections(config)

        expect(html).to have_selector('section[data-name="child"]')
      end
    end

    describe '#help_entries_menu' do
      it 'renders items for registered help entries' do
        config = Configuration.new
        config.help_entries.register('some')

        html = help_entries_menu(config)

        expect(html).to have_selector('li a[href="#some"]')
      end

      it 'renders expandable nested items' do
        config = Configuration.new
        config.help_entries.register('parent')
        config.help_entries.register('child', parent: 'parent')

        html = help_entries_menu(config)

        expect(html).to have_selector('li li a[href="#child"]')
        expect(html).to have_selector('li.expandable li')
      end
    end
  end
end
