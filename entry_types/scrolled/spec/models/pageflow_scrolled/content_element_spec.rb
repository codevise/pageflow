require 'spec_helper'

module PageflowScrolled
  RSpec.describe ContentElement do
    describe '.all_for_revision' do
      it 'returns all content elements in revision' do
        revision = create(:revision)
        section1 = create(:section, revision: revision)
        section2 = create(:section, revision: revision)
        content_element1 = create(:content_element, section: section1)
        content_element2 = create(:content_element, section: section1)
        content_element3 = create(:content_element, section: section2)
        other_revision = create(:revision)
        other_section = create(:section, revision: other_revision)
        create(:content_element, section: other_section)

        result = ContentElement.all_for_revision(revision)

        expect(result).to eq([content_element1, content_element2, content_element3])
      end
    end
  end
end
