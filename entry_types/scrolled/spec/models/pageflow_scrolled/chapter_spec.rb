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

    it 'increments position for subsequent chapters' do
      revision = create(:revision)
      chapter1 = create(:scrolled_chapter, revision: revision)
      chapter2 = create(:scrolled_chapter, revision: revision)
      expect(chapter1.position).to eq(0)
      expect(chapter2.position).to eq(1)
    end
  end
end
