require 'spec_helper'

module PageflowScrolled
  RSpec.describe Storyline do
    context 'as registered RevisionComponent' do
      it 'is created by default for drafts of new scrolled entries' do
        entry = create(:entry, type_name: 'scrolled')

        storylines = Storyline.all_for_revision(entry.draft)

        expect(storylines).to have(2).items
        expect(storylines.map(&:position)).to eq([0, 1])
      end

      it 'assigns main and excursions roles to default storylines' do
        entry = create(:entry, type_name: 'scrolled')

        storylines = Storyline.all_for_revision(entry.draft)

        expect(storylines.map(&:role)).to eq(%w[main excursions])
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

    describe '#role' do
      it 'returns stored role' do
        storyline = build(:scrolled_storyline, role: 'trash', configuration: {'main' => true})

        expect(storyline.role).to eq('trash')
      end

      it 'falls back to main for storylines with main flag' do
        storyline = build(:scrolled_storyline, role: nil, configuration: {'main' => true})

        expect(storyline.role).to eq('main')
      end

      it 'falls back to excursions for other storylines' do
        storyline = build(:scrolled_storyline, role: nil, configuration: {})

        expect(storyline.role).to eq('excursions')
      end
    end
  end
end
