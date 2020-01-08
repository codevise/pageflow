require 'spec_helper'

module PageflowScrolled
  RSpec.describe Chapter do
    it 'creates a main storyline if none exists' do
      chapter = create(:scrolled_chapter)
      expect(chapter.storyline).to be_present
    end

    it 'is attached to the main storyline for subsequent chapters in the same revision' do
      revision = create(:revision)
      chapter1 = create(:scrolled_chapter, revision: revision)
      chapter2 = create(:scrolled_chapter, revision: revision)
      expect(chapter1.storyline).to eq(chapter2.storyline)
    end

    describe '.all_for_revision' do
      it 'returns all chapters in revision' do
        revision = create(:revision)
        chapter1 = create(:scrolled_chapter, revision: revision)
        chapter2 = create(:scrolled_chapter, revision: revision)
        other_revision = create(:revision)
        create(:scrolled_chapter, revision: other_revision)

        result = Chapter.all_for_revision(revision)

        expect(result).to eq([chapter1, chapter2])
      end
    end
  end
end
