require 'spec_helper'

module Pageflow
  module Admin
    describe LocalesHelper do
      describe '#available_locales_collection' do
        it 'returns collection of configured available locales for select' do
          Pageflow.config.available_locales = [:de]

          pairs = available_locales_collection

          expect(pairs).to eq([['Deutsch', 'de']])
        end
      end
    end
  end
end
