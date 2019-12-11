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
  end
end
