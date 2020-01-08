require 'spec_helper'

module PageflowScrolled
  RSpec.describe Section do
    describe '.all_for_revision' do
      it 'returns all sections in revision' do
        revision = create(:revision)
        section1 = create(:section, revision: revision)
        section2 = create(:section, revision: revision)
        other_revision = create(:revision)
        create(:section, revision: other_revision)

        result = Section.all_for_revision(revision)

        expect(result).to eq([section1, section2])
      end
    end
  end
end
