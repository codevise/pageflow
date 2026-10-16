require 'spec_helper'

module PageflowScrolled
  RSpec.describe Section do
    describe '.all_for_revision' do
      it 'returns all sections in revision' do
        revision = create(:revision)
        section1 = create(:section, revision:)
        section2 = create(:section, revision:)
        other_revision = create(:revision)
        create(:section, revision: other_revision)

        result = Section.all_for_revision(revision)

        expect(result).to eq([section1, section2])
      end

      it 'excludes sections in trash storyline' do
        revision = create(:revision)
        section = create(:section, revision:)
        trash_storyline = Storyline.find_or_create_trash_for(revision)
        create(:section, chapter: create(:scrolled_chapter, storyline: trash_storyline))

        result = Section.all_for_revision(revision)

        expect(result).to eq([section])
      end
    end
  end
end
