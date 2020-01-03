require 'spec_helper'

module PageflowScrolled
  RSpec.describe ContentElement do
    describe '.all_for_revision' do
      it 'returns all content elements in revision' do
        revision = create(:revision)
        chapter = create(:scrolled_chapter, revision: revision)
        section1 = create(:section, chapter: chapter)
        section2 = create(:section, chapter: chapter)
        content_element1 = create(:content_element, section: section1)
        content_element2 = create(:content_element, section: section1)
        content_element3 = create(:content_element, section: section2)
        other_revision = create(:revision)
        other_chapter = create(:scrolled_chapter, revision: other_revision)
        other_section = create(:section, chapter: other_chapter)
        create(:content_element, section: other_section)

        result = ContentElement.all_for_revision(revision)

        expect(result).to eq([content_element1, content_element2, content_element3])
      end
    end
  end
end
