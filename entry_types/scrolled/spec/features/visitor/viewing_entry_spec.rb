require 'spec_helper'

require 'support/dominos/scrolled_entry'

RSpec.feature 'as visitor, viewing entry', js: true do
  scenario 'sees sections' do
    published_entry = create(:published_entry, type_name: 'scrolled')
    create(:section, revision: published_entry.revision)
    create(:section, revision: published_entry.revision)

    visit(pageflow.entry_path(published_entry))

    scrolled_entry = Dom::ScrolledEntry.find!

    expect(scrolled_entry.section_count).to eq(2)
  end
end
