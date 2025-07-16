require 'spec_helper'

module PageflowScrolled
  RSpec.describe ContentElement do
    describe '.all_for_revision' do
      it 'returns all content elements in revision' do
        revision = create(:revision)
        content_element1 = create(:content_element, revision:)
        content_element2 = create(:content_element, revision:)
        content_element3 = create(:content_element, revision:)
        other_revision = create(:revision)
        create(:content_element, revision: other_revision)

        result = ContentElement.all_for_revision(revision)

        expect(result).to eq([content_element1, content_element2, content_element3])
      end
    end
  end
end
