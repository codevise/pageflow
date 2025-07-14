require 'spec_helper'

module Pageflow
  describe Page do
    describe '#configuration=' do
      it 'assigns display_in_navigation' do
        page = build(:page, display_in_navigation: true)

        page.configuration = {'display_in_navigation' => false}

        expect(page.display_in_navigation).to eq(false)
      end
    end
  end
end
