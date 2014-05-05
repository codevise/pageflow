require 'spec_helper'

module Pageflow
  describe Page do
    describe '#configuration=' do
      it 'assigns display_in_navigation' do
        page = build(:page, :display_in_navigation => true)

        page.configuration = {'display_in_navigation' => false}

        expect(page.display_in_navigation).to eq(false)
      end

      it 'stores arbitrary options' do
        page = build(:page)

        page.configuration = {'some' => 'option'}

        expect(page.configuration['some']).to eq('option')
      end
    end

    describe '#perma_id' do
      it 'is created uniquely for new page' do
        page = create(:page)
        other_page = create(:page)

        expect(page.perma_id).to be_present
        expect(page.perma_id).not_to eq(other_page.perma_id)
      end

      it 'remains the same on subsequent saves' do
        page = create(:page)

        expect {
          page.update_attributes(:position => 25)
        }.not_to change { page.perma_id }
      end

      it 'remains the same when the page is copied' do
        page = create(:page)
        other_page = create(:page)

        expect(page.perma_id).to be_present
        expect(page.perma_id).not_to eq(other_page.perma_id)
      end
    end
  end
end
