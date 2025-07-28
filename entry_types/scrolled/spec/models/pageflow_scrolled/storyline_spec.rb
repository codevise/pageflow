require 'spec_helper'

module PageflowScrolled
  RSpec.describe Storyline do
    context 'as registered RevisionComponent' do
      it 'is created by default for drafts of new paged entries' do
        entry = create(:entry, type_name: 'scrolled')

        expect(Storyline.all_for_revision(entry.draft)).to have(1).item
      end

      it 'copies a duplicate of itself to new revision' do
        Pageflow.config.revision_components.register(Storyline)
        revision = create(:revision)
        storyline = Storyline.create!(revision:,
                                      configuration: {'some' => 'value'})

        copied_revision = revision.copy

        copied_storylines = Storyline.all_for_revision(copied_revision)
        expect(copied_storylines).not_to be_empty
        expect(copied_storylines.first).not_to eq(storyline)
        expect(copied_storylines.first.configuration['some']).to eq('value')
      end
    end
  end
end
