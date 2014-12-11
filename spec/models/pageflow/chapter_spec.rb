require 'spec_helper'

module Pageflow
  describe Chapter do
    describe '#configuration=' do
      it 'stores arbitrary options' do
        chapter = build(:chapter)

        chapter.configuration = {'some' => 'option'}

        expect(chapter.configuration['some']).to eq('option')
      end
    end
  end
end
